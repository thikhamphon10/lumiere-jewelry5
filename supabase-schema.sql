-- ==========================================================
-- LUMIÈRE JEWELRY — Supabase schema สำหรับระบบ POS
-- วิธีใช้: เปิด Supabase Dashboard → SQL Editor → New query
--          วางไฟล์นี้ทั้งหมด แล้วกด Run (รันครั้งเดียวพอ)
-- ==========================================================

-- ---------- 1) ตารางสินค้า + สต๊อก ----------
create table if not exists public.products (
  slug        text primary key,
  name        text    not null,
  style       text    not null,
  price       integer not null check (price >= 0),
  stock       integer not null default 0 check (stock >= 0),
  updated_at  timestamptz not null default now()
);

-- ---------- 2) ตารางการขาย ----------
create table if not exists public.sales (
  id               bigint generated always as identity primary key,
  order_number     text        not null unique,
  created_at       timestamptz not null default now(),
  subtotal         integer     not null,
  discount_code    text,
  discount_percent integer     not null default 0,
  discount_amount  integer     not null default 0,
  total            integer     not null,
  payment_method   text        not null,
  status           text        not null default 'Completed',
  channel          text        not null default 'pos'
);

-- ---------- 3) ตารางรายการสินค้าในแต่ละบิล ----------
create table if not exists public.sale_items (
  id           bigint generated always as identity primary key,
  sale_id      bigint  not null references public.sales(id) on delete cascade,
  product_slug text    not null,
  name         text    not null,
  style        text    not null,
  price        integer not null,
  qty          integer not null check (qty > 0),
  line_total   integer not null
);

create index if not exists sale_items_sale_id_idx on public.sale_items(sale_id);
create index if not exists sales_created_at_idx   on public.sales(created_at desc);

-- ---------- 4) ใส่สินค้า 10 รายการ + สต๊อกตั้งต้น ----------
insert into public.products (slug, name, style, price, stock) values
  ('minimal-pearl-necklace',   'Minimal Pearl Necklace',   'Minimal', 590, 20),
  ('minimal-heart-bracelet',   'Minimal Heart Bracelet',   'Minimal', 490, 15),
  ('minimal-circle-earrings',  'Minimal Circle Earrings',  'Minimal', 390, 18),
  ('elegant-crystal-necklace', 'Elegant Crystal Necklace', 'Elegant', 890, 10),
  ('elegant-pearl-earrings',   'Elegant Pearl Earrings',   'Elegant', 790, 12),
  ('elegant-star-bracelet',    'Elegant Star Bracelet',    'Elegant', 690, 14),
  ('sweet-heart-ring',         'Sweet Heart Ring',         'Sweet',   450, 20),
  ('sweet-flower-earrings',    'Sweet Flower Earrings',    'Sweet',   490, 16),
  ('bold-chain-necklace',      'Bold Chain Necklace',      'Bold',    990,  8),
  ('bold-statement-ring',      'Bold Statement Ring',      'Bold',    790, 10)
on conflict (slug) do nothing;

-- ==========================================================
-- 5) ฟังก์ชันขายสินค้า (ตัดสต๊อก + บันทึกบิล ใน transaction เดียว)
--    - เช็คสต๊อกก่อนตัด ถ้าไม่พอจะ error ทั้งบิล ไม่ตัดบางส่วน
--    - กันสต๊อกติดลบด้วย row lock (for update)
--    - สร้าง Order Number รูปแบบ LMyyyymmdd + running 3 หลักต่อวัน
-- ==========================================================
create or replace function public.create_sale(
  p_items           jsonb,        -- [{"slug":"...","qty":2}, ...]
  p_payment_method  text,
  p_discount_code   text default null,
  p_discount_percent integer default 0
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item            jsonb;
  v_slug            text;
  v_qty             integer;
  v_product         public.products%rowtype;
  v_subtotal        integer := 0;
  v_discount_amount integer := 0;
  v_total           integer;
  v_order_number    text;
  v_seq             integer;
  v_ymd             text;
  v_sale_id         bigint;
begin
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'ไม่มีรายการสินค้าในบิล';
  end if;

  if p_payment_method not in ('Cash', 'Card', 'QR') then
    raise exception 'Payment method ไม่ถูกต้อง: %', p_payment_method;
  end if;

  -- ล็อกแถวสินค้าทุกตัวก่อน แล้วตรวจสต๊อกให้ครบทั้งบิล
  for v_item in select * from jsonb_array_elements(p_items) loop
    v_slug := v_item ->> 'slug';
    v_qty  := (v_item ->> 'qty')::integer;

    if v_qty is null or v_qty <= 0 then
      raise exception 'จำนวนสินค้าไม่ถูกต้องสำหรับ %', v_slug;
    end if;

    select * into v_product from public.products where slug = v_slug for update;

    if not found then
      raise exception 'ไม่พบสินค้า: %', v_slug;
    end if;

    if v_product.stock < v_qty then
      raise exception 'สต๊อกไม่พอสำหรับ % (เหลือ % ต้องการ %)',
        v_product.name, v_product.stock, v_qty;
    end if;

    v_subtotal := v_subtotal + (v_product.price * v_qty);
  end loop;

  -- คิดส่วนลด (ยอมรับเฉพาะ LUMIERE10 = 10%)
  if p_discount_code is not null and upper(p_discount_code) = 'LUMIERE10' then
    p_discount_percent := 10;
    v_discount_amount  := round(v_subtotal * 0.10);
  else
    p_discount_code    := null;
    p_discount_percent := 0;
    v_discount_amount  := 0;
  end if;

  v_total := v_subtotal - v_discount_amount;

  -- สร้างเลขที่บิลแบบ running ต่อวัน
  v_ymd := to_char(now() at time zone 'Asia/Bangkok', 'YYYYMMDD');
  select coalesce(max(substring(order_number from 11 for 3)::integer), 0) + 1
    into v_seq
    from public.sales
   where order_number like 'LM' || v_ymd || '%';
  v_order_number := 'LM' || v_ymd || lpad(v_seq::text, 3, '0');

  -- บันทึกหัวบิล
  insert into public.sales (
    order_number, subtotal, discount_code, discount_percent,
    discount_amount, total, payment_method, status, channel
  ) values (
    v_order_number, v_subtotal, p_discount_code, p_discount_percent,
    v_discount_amount, v_total, p_payment_method, 'Completed', 'pos'
  ) returning id into v_sale_id;

  -- บันทึกรายการ + ตัดสต๊อกจริง
  for v_item in select * from jsonb_array_elements(p_items) loop
    v_slug := v_item ->> 'slug';
    v_qty  := (v_item ->> 'qty')::integer;

    select * into v_product from public.products where slug = v_slug;

    insert into public.sale_items (sale_id, product_slug, name, style, price, qty, line_total)
    values (v_sale_id, v_slug, v_product.name, v_product.style,
            v_product.price, v_qty, v_product.price * v_qty);

    update public.products
       set stock = stock - v_qty,
           updated_at = now()
     where slug = v_slug;
  end loop;

  return jsonb_build_object(
    'order_number',    v_order_number,
    'subtotal',        v_subtotal,
    'discount_code',   p_discount_code,
    'discount_amount', v_discount_amount,
    'total',           v_total,
    'payment_method',  p_payment_method
  );
end;
$$;

-- ==========================================================
-- 6) Row Level Security
--    โปรเจกต์นี้เป็นงานการศึกษา จึงเปิดให้ anon อ่านได้
--    แต่ "ห้ามแก้สต๊อก/บิลตรงๆ" — ต้องผ่านฟังก์ชัน create_sale เท่านั้น
-- ==========================================================
alter table public.products   enable row level security;
alter table public.sales      enable row level security;
alter table public.sale_items enable row level security;

drop policy if exists "read products"   on public.products;
drop policy if exists "read sales"      on public.sales;
drop policy if exists "read sale_items" on public.sale_items;

create policy "read products"   on public.products   for select to anon, authenticated using (true);
create policy "read sales"      on public.sales      for select to anon, authenticated using (true);
create policy "read sale_items" on public.sale_items for select to anon, authenticated using (true);

-- ไม่มี policy insert/update/delete = anon เขียนตรงๆ ไม่ได้
-- การขายทำผ่าน RPC ที่เป็น security definer เท่านั้น
grant execute on function public.create_sale(jsonb, text, text, integer) to anon, authenticated;

-- ==========================================================
-- (ทางเลือก) รีเซ็ตข้อมูลตอนสาธิต — ลบบิลทั้งหมดและคืนสต๊อกตั้งต้น
-- ลบเครื่องหมาย comment ออกแล้วรันเฉพาะส่วนนี้เมื่อต้องการ
-- ==========================================================
-- truncate public.sale_items, public.sales restart identity;
-- update public.products set stock = v.stock from (values
--   ('minimal-pearl-necklace',20),('minimal-heart-bracelet',15),
--   ('minimal-circle-earrings',18),('elegant-crystal-necklace',10),
--   ('elegant-pearl-earrings',12),('elegant-star-bracelet',14),
--   ('sweet-heart-ring',20),('sweet-flower-earrings',16),
--   ('bold-chain-necklace',8),('bold-statement-ring',10)
-- ) as v(slug, stock) where public.products.slug = v.slug;
