/* ==========================================================
   LUMIÈRE JEWELRY — script.js
   Shared product data + cart/checkout/receipt logic for every page.
   ========================================================== */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     PRODUCT DATA (fixed — do not add items beyond this list)
     --------------------------------------------------------- */
  const PRODUCTS = [
    { id: 1, slug: "minimal-pearl-necklace", name: "Minimal Pearl Necklace", type: "Necklace", typeTh: "สร้อยคอ", price: 590, style: "Minimal", desc: "สร้อยคอมุกเรียบหรู ใส่ได้ทุกวันโดยไม่ต้องคิดมาก", long: "ออกแบบให้เรียบง่ายแต่ไม่ธรรมดา จี้มุกเม็ดกลมแขวนบนสร้อยเส้นเรียวบาง เหมาะกับการสวมใส่ในชีวิตประจำวันตั้งแต่ไปทำงานจนถึงนัดพบเพื่อน" },
    { id: 2, slug: "minimal-heart-bracelet", name: "Minimal Heart Bracelet", type: "Bracelet", typeTh: "กำไล", price: 490, style: "Minimal", desc: "กำไลทรงหัวใจเรียบง่าย เพิ่มความอ่อนโยนให้ลุคประจำวัน", long: "กำไลข้อมือดีไซน์เรียบ มีจี้รูปหัวใจขนาดเล็กเป็นจุดเด่น น้ำหนักเบาสวมใส่สบาย เหมาะกับทุกโอกาสในชีวิตประจำวัน" },
    { id: 3, slug: "minimal-circle-earrings", name: "Minimal Circle Earrings", type: "Earrings", typeTh: "ต่างหู", price: 390, style: "Minimal", desc: "ต่างหูวงกลมเกลี้ยง คลาสสิกและใส่ง่ายในทุกโอกาส", long: "ต่างหูทรงวงกลมเกลี้ยงเกลาไร้ลวดลาย ให้ความรู้สึกสะอาดตา ใส่ได้ทั้งวันทำงานและวันหยุด" },
    { id: 4, slug: "elegant-crystal-necklace", name: "Elegant Crystal Necklace", type: "Necklace", typeTh: "สร้อยคอ", price: 890, style: "Elegant", desc: "สร้อยคอคริสตัลประกายหรู เหมาะกับค่ำคืนสำคัญ", long: "สร้อยคอประดับคริสตัลทรงหยดน้ำ ประกายแสงนุ่มนวลแต่โดดเด่น เหมาะสำหรับงานเลี้ยงหรือค่ำคืนสำคัญที่ต้องการความหรูหรา" },
    { id: 5, slug: "elegant-pearl-earrings", name: "Elegant Pearl Earrings", type: "Earrings", typeTh: "ต่างหู", price: 790, style: "Elegant", desc: "ต่างหูมุกดีไซน์หรูหรา เพิ่มความโดดเด่นให้ใบหน้า", long: "ต่างหูมุกทรงห้อยดีไซน์ปราณีต ให้ความรู้สึกหรูหราแบบคลาสสิก เหมาะกับโอกาสพิเศษที่ต้องการความสง่างาม" },
    { id: 6, slug: "elegant-star-bracelet", name: "Elegant Star Bracelet", type: "Bracelet", typeTh: "กำไล", price: 690, style: "Elegant", desc: "กำไลลายดาวประกายละมุน สำหรับโอกาสพิเศษ", long: "กำไลข้อมือลายดาวขนาดเล็กเรียงต่อกัน ประกายแวววาวแบบละมุน เพิ่มความหรูหราให้ข้อมือในโอกาสพิเศษ" },
    { id: 7, slug: "sweet-heart-ring", name: "Sweet Heart Ring", type: "Ring", typeTh: "แหวน", price: 450, style: "Sweet", desc: "แหวนหัวใจน่ารัก อ่อนหวานและมีเสน่ห์", long: "แหวนดีไซน์หัวใจขนาดพอดี ให้ความรู้สึกน่ารักสดใส เหมาะกับผู้ที่ชื่นชอบความอ่อนหวานมีเสน่ห์" },
    { id: 8, slug: "sweet-flower-earrings", name: "Sweet Flower Earrings", type: "Earrings", typeTh: "ต่างหู", price: 490, style: "Sweet", desc: "ต่างหูดอกไม้อ่อนหวาน เพิ่มความสดใสให้ทุกวัน", long: "ต่างหูทรงดอกไม้ขนาดเล็ก ดีไซน์อ่อนหวานน่ารัก เพิ่มความสดใสให้ลุคประจำวันได้ง่ายๆ" },
    { id: 9, slug: "bold-chain-necklace", name: "Bold Chain Necklace", type: "Necklace", typeTh: "สร้อยคอ", price: 990, style: "Bold", desc: "สร้อยคอโซ่ทรงหนา โดดเด่นและสะท้อนความมั่นใจ", long: "สร้อยคอโซ่ทรงหนาดีไซน์แข็งแรง สะท้อนความมั่นใจและตัวตนที่ชัดเจน เหมาะกับผู้ที่กล้าแสดงออก" },
    { id: 10, slug: "bold-statement-ring", name: "Bold Statement Ring", type: "Ring", typeTh: "แหวน", price: 790, style: "Bold", desc: "แหวนทรงใหญ่มีเอกลักษณ์ สำหรับคนที่กล้าแตกต่าง", long: "แหวนทรงใหญ่ดีไซน์โดดเด่นไม่ซ้ำใคร สำหรับผู้ที่ต้องการสร้างความแตกต่างและมั่นใจในสไตล์ของตัวเอง" }
  ];

  const FEATURED_IDS = [1, 4, 7, 9]; // one signature piece per mood, for Home

  function productById(id) { return PRODUCTS.find((p) => p.id === Number(id)); }
  function imagePath(p) { return p.slug + ".jpg"; }
  function fmtBaht(n) { return "\u0E3F" + n.toLocaleString("en-US") + " THB"; }

  /* ---------------------------------------------------------
     POS — starting inventory (fixed simulated stock)
     --------------------------------------------------------- */
  const DEFAULT_STOCK = {
    "minimal-pearl-necklace": 20,
    "minimal-heart-bracelet": 15,
    "minimal-circle-earrings": 18,
    "elegant-crystal-necklace": 10,
    "elegant-pearl-earrings": 12,
    "elegant-star-bracelet": 14,
    "sweet-heart-ring": 20,
    "sweet-flower-earrings": 16,
    "bold-chain-necklace": 8,
    "bold-statement-ring": 10
  };

  /* ---------------------------------------------------------
     CART — persisted in localStorage so it survives page changes
     --------------------------------------------------------- */
  const CART_KEY = "lumiere_cart_v1";
  const DISCOUNT_KEY = "lumiere_discount_v1";
  const LAST_ORDER_KEY = "lumiere_last_order_v1";
  const ORDER_SEQ_KEY = "lumiere_order_seq_v1";
  const VALID_DISCOUNT = { code: "LUMIERE10", percent: 10 };

  function getCart() {
    try {
      const raw = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      return Array.isArray(raw) ? raw.filter((l) => productById(l.id) && l.qty > 0) : [];
    } catch (e) { return []; }
  }
  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
  }
  function addToCart(id, qty) {
    qty = Math.max(1, qty || 1);
    const cart = getCart();
    const line = cart.find((l) => l.id === Number(id));
    if (line) line.qty = Math.min(20, line.qty + qty);
    else cart.push({ id: Number(id), qty: Math.min(20, qty) });
    saveCart(cart);
    return cart;
  }
  function setQty(id, qty) {
    let cart = getCart();
    qty = Math.round(Number(qty));
    if (!qty || qty < 1) { cart = cart.filter((l) => l.id !== Number(id)); }
    else {
      const line = cart.find((l) => l.id === Number(id));
      if (line) line.qty = Math.min(20, qty);
    }
    saveCart(cart);
    return cart;
  }
  function removeFromCart(id) {
    const cart = getCart().filter((l) => l.id !== Number(id));
    saveCart(cart);
    return cart;
  }
  function cartCount(cart) { return (cart || getCart()).reduce((s, l) => s + l.qty, 0); }
  function cartLines(cart) {
    return (cart || getCart()).map((l) => {
      const p = productById(l.id);
      return { product: p, qty: l.qty, lineTotal: p.price * l.qty };
    });
  }
  function cartSubtotal(cart) {
    return cartLines(cart).reduce((s, l) => s + l.lineTotal, 0);
  }

  function getDiscount() {
    try { return JSON.parse(localStorage.getItem(DISCOUNT_KEY) || "null"); } catch (e) { return null; }
  }
  function setDiscount(d) {
    if (d) localStorage.setItem(DISCOUNT_KEY, JSON.stringify(d));
    else localStorage.removeItem(DISCOUNT_KEY);
  }

  function nextOrderNumber() {
    const today = new Date();
    const ymd = today.getFullYear().toString() +
      String(today.getMonth() + 1).padStart(2, "0") +
      String(today.getDate()).padStart(2, "0");
    let seq = 1;
    try {
      const stored = JSON.parse(localStorage.getItem(ORDER_SEQ_KEY) || "null");
      if (stored && stored.ymd === ymd) seq = stored.seq + 1;
    } catch (e) {}
    localStorage.setItem(ORDER_SEQ_KEY, JSON.stringify({ ymd, seq }));
    return "LM" + ymd + String(seq).padStart(3, "0");
  }

  function updateCartBadge() {
    const n = cartCount();
    document.querySelectorAll("#cartCount").forEach((el) => { el.textContent = "(" + n + ")"; });
  }

  /* ---------------------------------------------------------
     POS — DATA BACKEND
     ---------------------------------------------------------
     สต๊อกและประวัติการขายเก็บที่ Supabase เมื่อกรอกคีย์ใน
     supabase-config.js แล้ว ถ้ายังไม่กรอก (หรือ Supabase ล่ม)
     จะสลับไปใช้ localStorage อัตโนมัติเพื่อให้หน้าเว็บไม่พัง
     --------------------------------------------------------- */
  const INVENTORY_KEY = "lumiere_inventory_v1";
  const SALES_KEY = "lumiere_sales_v1";

  const SB_CFG = (typeof window !== "undefined" && window.LUMIERE_SUPABASE) || {};
  const SB_READY = !!(
    typeof window !== "undefined" &&
    window.supabase &&
    typeof SB_CFG.SUPABASE_URL === "string" &&
    typeof SB_CFG.SUPABASE_ANON_KEY === "string" &&
    SB_CFG.SUPABASE_URL.startsWith("http") &&
    SB_CFG.SUPABASE_ANON_KEY.length > 20 &&
    !SB_CFG.SUPABASE_URL.includes("YOUR_SUPABASE") &&
    !SB_CFG.SUPABASE_ANON_KEY.includes("YOUR_SUPABASE")
  );

  const sb = SB_READY
    ? window.supabase.createClient(SB_CFG.SUPABASE_URL, SB_CFG.SUPABASE_ANON_KEY)
    : null;

  // โหมดที่กำลังใช้งานจริง — จะถูกปรับเป็น false ถ้าเรียก Supabase ไม่สำเร็จ
  let usingSupabase = SB_READY;

  // แคชในหน่วยความจำ เพื่อให้ฟังก์ชัน render ยังเรียกแบบ sync ได้เหมือนเดิม
  let STOCK_CACHE = null;
  let SALES_CACHE = [];

  /* ---------- localStorage backend ---------- */
  function lsGetInventory() {
    let inv = null;
    try { inv = JSON.parse(localStorage.getItem(INVENTORY_KEY)); } catch (e) {}
    if (!inv || typeof inv !== "object") inv = {};
    inv = Object.assign({}, DEFAULT_STOCK, inv);
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(inv));
    return inv;
  }
  function lsSaveInventory(inv) { localStorage.setItem(INVENTORY_KEY, JSON.stringify(inv)); }
  function lsGetSales() {
    try {
      const raw = JSON.parse(localStorage.getItem(SALES_KEY) || "[]");
      return Array.isArray(raw) ? raw : [];
    } catch (e) { return []; }
  }
  function lsAddSale(order) {
    const sales = lsGetSales();
    sales.unshift(order);
    localStorage.setItem(SALES_KEY, JSON.stringify(sales));
  }

  /* ---------- โหลดสต๊อก ---------- */
  async function loadStock() {
    if (usingSupabase) {
      try {
        const { data, error } = await sb.from("products").select("slug, stock");
        if (error) throw error;
        const inv = {};
        (data || []).forEach((row) => { inv[row.slug] = row.stock; });
        STOCK_CACHE = Object.assign({}, DEFAULT_STOCK, inv);
        return STOCK_CACHE;
      } catch (e) {
        console.warn("Supabase ไม่พร้อมใช้งาน — สลับไปใช้ localStorage", e);
        usingSupabase = false;
      }
    }
    STOCK_CACHE = lsGetInventory();
    return STOCK_CACHE;
  }

  // อ่านจากแคช (sync) — ใช้ในฟังก์ชัน render
  function getInventory() {
    if (!STOCK_CACHE) STOCK_CACHE = usingSupabase ? Object.assign({}, DEFAULT_STOCK) : lsGetInventory();
    return STOCK_CACHE;
  }
  function getStock(slug) {
    const inv = getInventory();
    return inv[slug] != null ? inv[slug] : 0;
  }
  function stockStatus(stock) {
    if (stock <= 0) return "out";
    if (stock <= 5) return "low";
    return "in";
  }
  function stockLabel(status) {
    return status === "out" ? "Out of Stock" : status === "low" ? "Low Stock" : "In Stock";
  }

  /* ---------- โหลดประวัติการขาย ---------- */
  async function loadSales() {
    if (usingSupabase) {
      try {
        const { data, error } = await sb
          .from("sales")
          .select("order_number, created_at, subtotal, discount_code, discount_percent, discount_amount, total, payment_method, status, channel, sale_items(name, style, price, qty, line_total)")
          .order("created_at", { ascending: false })
          .limit(200);
        if (error) throw error;
        SALES_CACHE = (data || []).map((row) => ({
          orderNumber: row.order_number,
          date: row.created_at,
          channel: row.channel,
          items: (row.sale_items || []).map((it) => ({
            name: it.name, style: it.style, price: it.price, qty: it.qty, lineTotal: it.line_total
          })),
          subtotal: row.subtotal,
          discountCode: row.discount_code,
          discountPercent: row.discount_percent,
          discountAmount: row.discount_amount,
          total: row.total,
          customer: null,
          paymentMethod: row.payment_method,
          status: row.status
        }));
        return SALES_CACHE;
      } catch (e) {
        console.warn("โหลดประวัติการขายจาก Supabase ไม่สำเร็จ — ใช้ localStorage", e);
        usingSupabase = false;
      }
    }
    SALES_CACHE = lsGetSales();
    return SALES_CACHE;
  }
  function getSales() { return SALES_CACHE; }

  /* ---------- บันทึกการขาย + ตัดสต๊อก ----------
     Supabase: เรียก RPC create_sale ซึ่งเช็คสต๊อก ตัดสต๊อก และบันทึกบิล
               ใน transaction เดียว (สต๊อกไม่พอ = ยกเลิกทั้งบิล)
     fallback: ตัดสต๊อกและบันทึกลง localStorage
     คืนค่า { ok, order, message }
     --------------------------------------------------------- */
  async function commitSale(lines, paymentMethod, discount) {
    if (usingSupabase) {
      try {
        const { data, error } = await sb.rpc("create_sale", {
          p_items: lines.map((l) => ({ slug: l.product.slug, qty: l.qty })),
          p_payment_method: paymentMethod,
          p_discount_code: discount ? discount.code : null,
          p_discount_percent: discount ? discount.percent : 0
        });
        if (error) throw error;

        const order = {
          orderNumber: data.order_number,
          date: new Date().toISOString(),
          channel: "pos",
          items: lines.map((l) => ({
            name: l.product.name, style: l.product.style,
            price: l.product.price, qty: l.qty, lineTotal: l.lineTotal
          })),
          subtotal: data.subtotal,
          discountCode: data.discount_code,
          discountPercent: discount ? discount.percent : 0,
          discountAmount: data.discount_amount,
          total: data.total,
          customer: null,
          paymentMethod: data.payment_method,
          status: "Completed"
        };
        await loadStock();
        return { ok: true, order: order };
      } catch (e) {
        const msg = (e && (e.message || e.hint)) || "บันทึกการขายไม่สำเร็จ";
        console.error("create_sale ล้มเหลว", e);
        return { ok: false, message: msg };
      }
    }

    // ----- fallback: localStorage -----
    const inv = lsGetInventory();
    for (const l of lines) {
      if ((inv[l.product.slug] || 0) < l.qty) {
        return { ok: false, message: "สต๊อกไม่พอสำหรับ " + l.product.name };
      }
    }
    const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
    const discountAmount = discount ? Math.round(subtotal * (discount.percent / 100)) : 0;
    const order = {
      orderNumber: nextOrderNumber(),
      date: new Date().toISOString(),
      channel: "pos",
      items: lines.map((l) => ({
        name: l.product.name, style: l.product.style,
        price: l.product.price, qty: l.qty, lineTotal: l.lineTotal
      })),
      subtotal: subtotal,
      discountCode: discount ? discount.code : null,
      discountPercent: discount ? discount.percent : 0,
      discountAmount: discountAmount,
      total: subtotal - discountAmount,
      customer: null,
      paymentMethod: paymentMethod,
      status: "Completed"
    };
    lines.forEach((l) => { inv[l.product.slug] = Math.max(0, inv[l.product.slug] - l.qty); });
    lsSaveInventory(inv);
    lsAddSale(order);
    STOCK_CACHE = inv;
    SALES_CACHE = lsGetSales();
    return { ok: true, order: order };
  }

  /* ---------------------------------------------------------
     TELEGRAM NOTIFICATION
     ---------------------------------------------------------
     ส่งแจ้งเตือนเข้า Telegram เมื่อบันทึกการขายสำเร็จ
     - ทำงานแบบ fire-and-forget: ถ้าส่งไม่สำเร็จจะไม่ทำให้การขายล้มเหลว
       (บิลถูกบันทึกและตัดสต๊อกไปแล้ว การแจ้งเตือนเป็นแค่ส่วนเสริม)
     - รองรับ 2 ช่องทาง: ยิงตรง Bot API หรือผ่าน PROXY_URL (Edge Function)
     --------------------------------------------------------- */
  const TG_CFG = (typeof window !== "undefined" && window.LUMIERE_TELEGRAM) || {};

  function tgConfigured() {
    if (!TG_CFG.ENABLED) return false;
    if (typeof TG_CFG.PROXY_URL === "string" && TG_CFG.PROXY_URL.startsWith("http")) return true;
    const t = TG_CFG.TELEGRAM_BOT_TOKEN, c = TG_CFG.TELEGRAM_CHAT_ID;
    return (
      typeof t === "string" && typeof c === "string" &&
      t.length > 20 && c.length > 0 &&
      !t.includes("YOUR_TELEGRAM") && !c.includes("YOUR_TELEGRAM")
    );
  }

  // กัน HTML injection ในชื่อสินค้า (Telegram parse_mode = HTML)
  function tgEscape(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function tgFormatDateTime(iso) {
    try {
      return new Date(iso).toLocaleString("th-TH", {
        timeZone: "Asia/Bangkok",
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit"
      }) + " น.";
    } catch (e) {
      return new Date(iso).toISOString();
    }
  }

  function buildTelegramMessage(order) {
    const lines = [];
    lines.push("\u{1F6D2} <b>\u0E21\u0E35\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E2A\u0E31\u0E48\u0E07\u0E0B\u0E37\u0E49\u0E2D\u0E43\u0E2B\u0E21\u0E48!</b> (LUMI\u00C8RE JEWELRY)");
    lines.push("");
    lines.push("\u{1F9FE} <b>Order:</b> " + tgEscape(order.orderNumber));
    lines.push("\u{1F551} " + tgEscape(tgFormatDateTime(order.date)));
    lines.push("");
    lines.push("<b>\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32</b>");

    order.items.forEach(function (it) {
      lines.push(
        "\u2022 " + tgEscape(it.name) +
        "  \u00D7" + it.qty +
        "  \u2014 " + tgEscape(fmtBaht(it.lineTotal))
      );
    });

    lines.push("");
    lines.push("Subtotal: " + tgEscape(fmtBaht(order.subtotal)));
    if (order.discountAmount > 0) {
      lines.push(
        "Discount (" + tgEscape(order.discountCode || "") + " " + order.discountPercent + "%): \u2212" +
        tgEscape(fmtBaht(order.discountAmount))
      );
    }
    lines.push("\u{1F4B0} <b>Total: " + tgEscape(fmtBaht(order.total)) + "</b>");
    lines.push("\u{1F4B3} Payment: " + tgEscape(order.paymentMethod));

    return lines.join("\n");
  }

  async function sendTelegramNotification(order) {
    if (!tgConfigured()) return { ok: false, skipped: true };

    const text = buildTelegramMessage(order);

    try {
      let url, payload;

      if (typeof TG_CFG.PROXY_URL === "string" && TG_CFG.PROXY_URL.startsWith("http")) {
        // ส่งผ่าน Edge Function — token เก็บฝั่ง server
        url = TG_CFG.PROXY_URL;
        payload = { text: text, order: order };
      } else {
        url = "https://api.telegram.org/bot" + TG_CFG.TELEGRAM_BOT_TOKEN + "/sendMessage";
        payload = {
          chat_id: TG_CFG.TELEGRAM_CHAT_ID,
          text: text,
          parse_mode: "HTML",
          disable_web_page_preview: true
        };
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(function () { return {}; });

      if (!res.ok || data.ok === false) {
        const why = (data && (data.description || data.error)) || ("HTTP " + res.status);
        console.warn("Telegram: \u0E2A\u0E48\u0E07\u0E41\u0E08\u0E49\u0E07\u0E40\u0E15\u0E37\u0E2D\u0E19\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08 \u2014 " + why);
        return { ok: false, message: why };
      }
      return { ok: true };
    } catch (e) {
      console.warn("Telegram: \u0E2A\u0E48\u0E07\u0E41\u0E08\u0E49\u0E07\u0E40\u0E15\u0E37\u0E2D\u0E19\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08", e);
      return { ok: false, message: (e && e.message) || "network error" };
    }
  }

  function isToday(iso) {
    const d = new Date(iso), t = new Date();
    return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
  }
  function todayStats() {
    const todaySales = getSales().filter((s) => isToday(s.date));
    const totalSales = todaySales.reduce((sum, o) => sum + o.total, 0);
    const orders = todaySales.length;
    const itemsSold = todaySales.reduce((sum, o) => sum + o.items.reduce((a, it) => a + it.qty, 0), 0);
    const avgOrder = orders ? Math.round(totalSales / orders) : 0;
    return { totalSales, orders, itemsSold, avgOrder };
  }

  /* ---------------------------------------------------------
     POS — CURRENT ORDER CART (separate from the site shopping cart,
     so a staff member's in-progress sale never mixes with a
     customer's own cart on cart.html / order.html)
     --------------------------------------------------------- */
  const POS_CART_KEY = "lumiere_pos_cart_v1";

  function getPosCart() {
    try {
      const raw = JSON.parse(localStorage.getItem(POS_CART_KEY) || "[]");
      return Array.isArray(raw) ? raw.filter((l) => productById(l.id) && l.qty > 0) : [];
    } catch (e) { return []; }
  }
  function savePosCart(cart) { localStorage.setItem(POS_CART_KEY, JSON.stringify(cart)); }
  function posAddToCart(id, qty) {
    const p = productById(id);
    if (!p) return getPosCart();
    const stock = getStock(p.slug);
    qty = Math.max(1, qty || 1);
    const cart = getPosCart();
    const line = cart.find((l) => l.id === Number(id));
    const already = line ? line.qty : 0;
    const nextQty = Math.min(stock, already + qty);
    if (nextQty <= 0) return cart;
    if (line) line.qty = nextQty;
    else cart.push({ id: Number(id), qty: nextQty });
    savePosCart(cart);
    return cart;
  }
  function posSetQty(id, qty) {
    const p = productById(id);
    let cart = getPosCart();
    const stock = p ? getStock(p.slug) : 0;
    qty = Math.min(stock, Math.max(0, Math.round(Number(qty)) || 0));
    if (qty <= 0) { cart = cart.filter((l) => l.id !== Number(id)); }
    else {
      const line = cart.find((l) => l.id === Number(id));
      if (line) line.qty = qty;
    }
    savePosCart(cart);
    return cart;
  }
  function posRemoveFromCart(id) {
    const cart = getPosCart().filter((l) => l.id !== Number(id));
    savePosCart(cart);
    return cart;
  }

  /* ---------------------------------------------------------
     Shared image markup with graceful fallback (never a broken icon)
     --------------------------------------------------------- */
  function mediaHTML(p, imgClass) {
    return '<img class="' + (imgClass || "") + '" src="' + imagePath(p) + '" alt="' + p.name + '" loading="lazy" ' +
      'onerror="this.onerror=null;this.style.background=\'linear-gradient(160deg,#EDE2CC,#F1E9D8)\';this.removeAttribute(\'src\');">';
  }

  /* ---------------------------------------------------------
     Product card (used on Home + Collection)
     --------------------------------------------------------- */
  function productCardHTML(p) {
    return `
      <article class="product-card" data-style="${p.style}">
        <div class="product-card__visual">
          <span class="product-card__tag">${p.style}</span>
          ${mediaHTML(p)}
        </div>
        <div class="product-card__body">
          <p class="product-card__type">${p.typeTh}</p>
          <h3 class="product-card__name">${p.name}</h3>
          <p class="product-card__price">${fmtBaht(p.price)}</p>
          <div class="product-card__actions">
            <a class="btn-mini btn-mini--outline" href="product.html?id=${p.id}">View Details</a>
            <button class="btn-mini btn-mini--solid" data-add="${p.id}">Add to Cart</button>
          </div>
        </div>
      </article>`;
  }

  function attachCardHandlers(scope) {
    scope.querySelectorAll("[data-add]").forEach((btn) => {
      btn.addEventListener("click", () => {
        addToCart(Number(btn.dataset.add), 1);
        const original = btn.textContent;
        btn.textContent = "Added \u2713";
        btn.classList.add("is-added");
        setTimeout(() => { btn.textContent = original; btn.classList.remove("is-added"); }, 1200);
      });
    });
  }

  /* ---------------------------------------------------------
     Nav: current-page highlight, mobile toggle, cart badge
     --------------------------------------------------------- */
  function initNav() {
    const page = document.body.dataset.page;
    document.querySelectorAll("[data-nav-links] a[data-page]").forEach((a) => {
      if (a.dataset.page === page) {
        a.classList.add("is-current");
        a.setAttribute("aria-current", "page");
      }
    });
    const navToggle = document.getElementById("navToggle");
    const navMobile = document.getElementById("navMobile");
    if (navToggle && navMobile) {
      navToggle.addEventListener("click", () => {
        const isOpen = navMobile.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
      });
      navMobile.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
          navMobile.classList.remove("is-open");
          navToggle.setAttribute("aria-expanded", "false");
        });
      });
    }
    updateCartBadge();
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------------------
     PAGE: home — featured collection
     --------------------------------------------------------- */
  function initHome() {
    const grid = document.getElementById("featuredGrid");
    if (!grid) return;
    const items = FEATURED_IDS.map(productById);
    grid.innerHTML = items.map(productCardHTML).join("");
    attachCardHandlers(grid);
  }

  /* ---------------------------------------------------------
     PAGE: collection — filterable grid
     --------------------------------------------------------- */
  function initCollection() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;
    const filterBar = document.getElementById("filterBar");
    const emptyState = document.getElementById("emptyState");

    function render(filter) {
      const list = filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.style.toLowerCase() === filter);
      grid.innerHTML = list.map(productCardHTML).join("");
      if (emptyState) emptyState.hidden = list.length !== 0;
      attachCardHandlers(grid);
    }

    // preset filter from ?style= query (case-insensitive: Minimal / minimal / MINIMAL)
    const params = new URLSearchParams(location.search);
    const styleParam = (params.get("style") || "all").toLowerCase();
    const validStyles = ["all", "minimal", "elegant", "sweet", "bold"];
    const initial = validStyles.includes(styleParam) ? styleParam : "all";

    filterBar.querySelectorAll(".filter__btn").forEach((btn) => {
      const isMatch = btn.dataset.filter === initial;
      btn.classList.toggle("is-active", isMatch);
      btn.setAttribute("aria-selected", String(isMatch));
    });

    filterBar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter__btn");
      if (!btn) return;
      filterBar.querySelectorAll(".filter__btn").forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
      render(btn.dataset.filter);
    });

    render(initial);
  }

  /* ---------------------------------------------------------
     PAGE: product detail
     --------------------------------------------------------- */
  function initProduct() {
    const root = document.getElementById("productDetailRoot");
    if (!root) return;
    const notFound = document.getElementById("productNotFound");
    const params = new URLSearchParams(location.search);
    const p = productById(params.get("id"));

    if (!p) {
      root.hidden = true;
      if (notFound) notFound.hidden = false;
      return;
    }
    root.hidden = false;
    if (notFound) notFound.hidden = true;

    document.title = p.name + " — LUMIÈRE JEWELRY";
    document.getElementById("pdMedia").innerHTML = mediaHTML(p);
    document.getElementById("pdStyle").textContent = p.style;
    document.getElementById("pdName").textContent = p.name;
    document.getElementById("pdType").textContent = p.typeTh + " / " + p.type;
    document.getElementById("pdPrice").textContent = fmtBaht(p.price);
    document.getElementById("pdDesc").textContent = p.desc;
    document.getElementById("pdLong").textContent = p.long;
    document.getElementById("crumbName").textContent = p.name;

    const qtyInput = document.getElementById("pdQty");
    document.getElementById("pdQtyMinus").addEventListener("click", () => {
      qtyInput.value = Math.max(1, Number(qtyInput.value) - 1);
    });
    document.getElementById("pdQtyPlus").addEventListener("click", () => {
      qtyInput.value = Math.min(20, Number(qtyInput.value) + 1);
    });

    const addBtn = document.getElementById("pdAddToCart");
    const msg = document.getElementById("pdAddedMsg");
    addBtn.addEventListener("click", () => {
      addToCart(p.id, Number(qtyInput.value) || 1);
      msg.classList.add("is-visible");
      clearTimeout(addBtn._t);
      addBtn._t = setTimeout(() => msg.classList.remove("is-visible"), 2200);
    });

    // Related products: other items sharing the same style
    const relatedGrid = document.getElementById("relatedGrid");
    if (relatedGrid) {
      const related = PRODUCTS.filter((x) => x.style === p.style && x.id !== p.id).slice(0, 3);
      relatedGrid.innerHTML = related.map(productCardHTML).join("");
      attachCardHandlers(relatedGrid);
    }
  }

  /* ---------------------------------------------------------
     PAGE: cart
     --------------------------------------------------------- */
  function cartLineHTML(line) {
    const p = line.product;
    return `
      <div class="order-item" data-line="${p.id}">
        ${mediaHTML(p)}
        <div class="order-item__info">
          <p class="order-item__name">${p.name}</p>
          <p class="order-item__meta">${p.style} &middot; ${fmtBaht(p.price)}</p>
        </div>
        <div class="order-item__qty">
          <input type="number" min="1" max="20" value="${line.qty}" data-qty="${p.id}" aria-label="Quantity">
        </div>
        <div class="order-item__line">${fmtBaht(line.lineTotal)}</div>
        <button class="order-item__remove" data-remove="${p.id}" aria-label="Remove">&times;</button>
      </div>`;
  }

  function initCart() {
    const root = document.getElementById("cartRoot");
    if (!root) return;
    const emptyState = document.getElementById("cartEmpty");
    const listEl = document.getElementById("cartList");
    const subtotalEl = document.getElementById("cartSubtotal");

    function render() {
      const cart = getCart();
      if (cart.length === 0) {
        root.hidden = true;
        emptyState.hidden = false;
        return;
      }
      root.hidden = false;
      emptyState.hidden = true;
      const lines = cartLines(cart);
      listEl.innerHTML = lines.map(cartLineHTML).join("");
      subtotalEl.textContent = fmtBaht(cartSubtotal(cart));

      listEl.querySelectorAll("[data-qty]").forEach((input) => {
        input.addEventListener("change", () => {
          setQty(Number(input.dataset.qty), input.value);
          render();
        });
      });
      listEl.querySelectorAll("[data-remove]").forEach((btn) => {
        btn.addEventListener("click", () => {
          removeFromCart(Number(btn.dataset.remove));
          render();
        });
      });
    }
    render();
  }

  /* ---------------------------------------------------------
     PAGE: checkout (order.html)
     --------------------------------------------------------- */
  function initCheckout() {
    const root = document.getElementById("checkoutRoot");
    if (!root) return;
    const emptyState = document.getElementById("checkoutEmpty");
    const listEl = document.getElementById("checkoutList");
    const subtotalEl = document.getElementById("checkoutSubtotal");
    const discountRowEl = document.getElementById("checkoutDiscountRow");
    const discountAmountEl = document.getElementById("checkoutDiscountAmount");
    const totalEl = document.getElementById("checkoutTotal");
    const discountInput = document.getElementById("discountInput");
    const discountMsg = document.getElementById("discountMsg");
    const applyBtn = document.getElementById("applyDiscountBtn");
    const form = document.getElementById("checkoutForm");
    const confirmEl = document.getElementById("checkoutConfirm");
    const formColEl = document.getElementById("checkoutFormCol");
    const summaryColEl = document.getElementById("checkoutSummaryCol");

    function currentTotals() {
      const cart = getCart();
      const subtotal = cartSubtotal(cart);
      const discount = getDiscount();
      const discountAmount = discount ? Math.round(subtotal * (discount.percent / 100)) : 0;
      const total = subtotal - discountAmount;
      return { cart, subtotal, discount, discountAmount, total };
    }

    function render() {
      const { cart, subtotal, discount, discountAmount, total } = currentTotals();
      if (cart.length === 0) {
        root.hidden = true;
        emptyState.hidden = false;
        return;
      }
      root.hidden = false;
      emptyState.hidden = true;
      listEl.innerHTML = cartLines(cart).map((line) => `
        <div class="order-item">
          ${mediaHTML(line.product)}
          <div class="order-item__info">
            <p class="order-item__name">${line.product.name}</p>
            <p class="order-item__meta">${line.product.style} &middot; Qty ${line.qty} &middot; ${fmtBaht(line.product.price)}</p>
          </div>
          <div class="order-item__line">${fmtBaht(line.lineTotal)}</div>
        </div>`).join("");

      subtotalEl.textContent = fmtBaht(subtotal);
      if (discount) {
        discountRowEl.hidden = false;
        discountAmountEl.textContent = "\u2212" + fmtBaht(discountAmount);
        discountInput.value = discount.code;
      } else {
        discountRowEl.hidden = true;
      }
      totalEl.textContent = fmtBaht(total);
    }

    applyBtn.addEventListener("click", () => {
      const code = (discountInput.value || "").trim().toUpperCase();
      if (!code) return;
      if (code === VALID_DISCOUNT.code) {
        setDiscount(VALID_DISCOUNT);
        discountMsg.textContent = "Discount applied: " + VALID_DISCOUNT.percent + "% off";
        discountMsg.className = "discount-msg is-success";
      } else {
        setDiscount(null);
        discountMsg.textContent = "Invalid discount code.";
        discountMsg.className = "discount-msg is-error";
      }
      render();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const { cart, subtotal, discount, discountAmount, total } = currentTotals();
      if (cart.length === 0) return;

      const customer = {
        name: document.getElementById("custName").value.trim(),
        phone: document.getElementById("custPhone").value.trim(),
        email: document.getElementById("custEmail").value.trim(),
        address: document.getElementById("custAddress").value.trim(),
        notes: document.getElementById("custNotes").value.trim()
      };
      if (!customer.name || !customer.phone || !customer.email || !customer.address) return;

      const orderNumber = nextOrderNumber();
      const order = {
        orderNumber,
        date: new Date().toISOString(),
        items: cartLines(cart).map((l) => ({
          name: l.product.name, style: l.product.style, price: l.product.price, qty: l.qty, lineTotal: l.lineTotal
        })),
        subtotal, discountCode: discount ? discount.code : null, discountPercent: discount ? discount.percent : 0,
        discountAmount, total, customer
      };
      localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
      saveCart([]);
      setDiscount(null);

      document.getElementById("checkoutOrderNumber").textContent = "Order Number: " + orderNumber;
      document.getElementById("checkoutTotalConfirm").textContent = "Total: " + fmtBaht(total);
      formColEl.hidden = true;
      summaryColEl.hidden = true;
      confirmEl.hidden = false;
    });

    render();
  }

  /* ---------------------------------------------------------
     PAGE: receipt
     --------------------------------------------------------- */
  function initReceipt() {
    const root = document.getElementById("receiptRoot");
    if (!root) return;
    const emptyState = document.getElementById("receiptEmpty");
    let order = null;
    try { order = JSON.parse(localStorage.getItem(LAST_ORDER_KEY) || "null"); } catch (e) {}

    if (!order) {
      root.hidden = true;
      emptyState.hidden = false;
      return;
    }
    root.hidden = false;
    emptyState.hidden = true;

    document.getElementById("rcOrderNumber").textContent = order.orderNumber;
    document.getElementById("rcDate").textContent = new Date(order.date).toLocaleString("en-GB", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
    document.getElementById("rcItems").innerHTML = order.items.map((it) => `
      <tr>
        <td>${it.name}<br><span style="color:var(--ink-45);font-size:0.78rem;">${it.style}</span></td>
        <td>${it.qty}</td>
        <td>${fmtBaht(it.price)}</td>
        <td>${fmtBaht(it.lineTotal)}</td>
      </tr>`).join("");
    document.getElementById("rcSubtotal").textContent = fmtBaht(order.subtotal);
    const discountRow = document.getElementById("rcDiscountRow");
    if (order.discountAmount > 0) {
      discountRow.hidden = false;
      document.getElementById("rcDiscount").textContent = "\u2212" + fmtBaht(order.discountAmount) + " (" + order.discountCode + ")";
    } else {
      discountRow.hidden = true;
    }
    document.getElementById("rcTotal").textContent = fmtBaht(order.total);

    const rcCustomerEl = document.getElementById("rcCustomer");
    if (order.customer) {
      rcCustomerEl.innerHTML =
        "<strong>" + order.customer.name + "</strong><br>" +
        order.customer.phone + " &middot; " + order.customer.email + "<br>" +
        order.customer.address +
        (order.customer.notes ? "<br><em>" + order.customer.notes + "</em>" : "") +
        (order.paymentMethod ? "<br>Payment: " + order.paymentMethod : "");
    } else {
      rcCustomerEl.innerHTML =
        "<strong>In-store Sale (POS)</strong>" +
        (order.paymentMethod ? "<br>Payment Method: " + order.paymentMethod : "");
    }

    document.getElementById("printBtn").addEventListener("click", () => window.print());
  }

  /* ---------------------------------------------------------
     PAGE: pos — Point of Sale simulation
     --------------------------------------------------------- */
  function initPOS() {
    const grid = document.getElementById("posProductGrid");
    if (!grid) return;

    const searchInput = document.getElementById("posSearch");
    const filterBar = document.getElementById("posFilterBar");
    const orderListEl = document.getElementById("posOrderList");
    const orderEmptyEl = document.getElementById("posOrderEmpty");
    const subtotalEl = document.getElementById("posSubtotal");
    const discountRowEl = document.getElementById("posDiscountRow");
    const discountAmountEl = document.getElementById("posDiscountAmount");
    const totalEl = document.getElementById("posTotal");
    const discountInput = document.getElementById("posDiscountInput");
    const discountMsg = document.getElementById("posDiscountMsg");
    const applyBtn = document.getElementById("posApplyDiscountBtn");
    const payButtons = document.querySelectorAll(".pay-method");
    const checkoutBtn = document.getElementById("posCheckoutBtn");
    const mainPanel = document.getElementById("posMainPanel");
    const successEl = document.getElementById("posSuccess");
    const newSaleBtn = document.getElementById("posNewSaleBtn");

    let currentFilter = "all";
    let currentSearch = "";
    let selectedPayment = "Cash";

    function renderDashboard() {
      const s = todayStats();
      document.getElementById("statSales").textContent = fmtBaht(s.totalSales);
      document.getElementById("statOrders").textContent = String(s.orders);
      document.getElementById("statItems").textContent = String(s.itemsSold);
      document.getElementById("statAvg").textContent = fmtBaht(s.avgOrder);
    }

    function posCardHTML(p) {
      const stock = getStock(p.slug);
      const status = stockStatus(stock);
      const outOfStock = status === "out";
      return `
        <article class="pos-product-card">
          <div class="pos-product-card__visual">${mediaHTML(p)}</div>
          <div class="pos-product-card__body">
            <p class="pos-product-card__style">${p.style}</p>
            <h3 class="pos-product-card__name">${p.name}</h3>
            <p class="pos-product-card__price">${fmtBaht(p.price)}</p>
            <p class="pos-product-card__stock">
              <span class="stock-pill stock-pill--${status}">${stockLabel(status)}</span> ${stock} left
            </p>
            <button class="btn-mini btn-mini--solid" data-pos-add="${p.id}" ${outOfStock ? "disabled" : ""}>
              ${outOfStock ? "Out of Stock" : "Add"}
            </button>
          </div>
        </article>`;
    }

    function renderProducts() {
      let list = PRODUCTS;
      if (currentFilter !== "all") list = list.filter((p) => p.style.toLowerCase() === currentFilter);
      if (currentSearch) list = list.filter((p) => p.name.toLowerCase().includes(currentSearch));
      grid.innerHTML = list.length
        ? list.map(posCardHTML).join("")
        : '<p class="product-grid__empty" style="grid-column:1/-1;">ไม่พบสินค้าที่ค้นหา</p>';

      grid.querySelectorAll("[data-pos-add]").forEach((btn) => {
        btn.addEventListener("click", () => {
          posAddToCart(Number(btn.dataset.posAdd), 1);
          renderOrder();
          renderProducts();
        });
      });
    }

    function currentTotals() {
      const cart = getPosCart();
      const subtotal = cartSubtotal(cart);
      const discount = getDiscount();
      const discountAmount = discount ? Math.round(subtotal * (discount.percent / 100)) : 0;
      const total = subtotal - discountAmount;
      return { cart, subtotal, discount, discountAmount, total };
    }

    function posLineHTML(line) {
      const p = line.product;
      return `
        <div class="order-item">
          ${mediaHTML(p)}
          <div class="order-item__info">
            <p class="order-item__name">${p.name}</p>
            <p class="order-item__meta">${p.style} &middot; ${fmtBaht(p.price)}</p>
            <div class="order-item__qty">
              <span class="qty-stepper--sm">
                <button type="button" data-pos-dec="${p.id}" aria-label="ลดจำนวน">&minus;</button>
                <input type="number" min="0" max="20" value="${line.qty}" data-pos-qty="${p.id}" aria-label="จำนวน">
                <button type="button" data-pos-inc="${p.id}" aria-label="เพิ่มจำนวน">+</button>
              </span>
            </div>
          </div>
          <div class="order-item__line">${fmtBaht(line.lineTotal)}</div>
          <button class="order-item__remove" data-pos-remove="${p.id}" aria-label="Remove">&times;</button>
        </div>`;
    }

    function renderOrder() {
      const { cart, subtotal, discount, discountAmount, total } = currentTotals();

      if (cart.length === 0) {
        orderListEl.innerHTML = "";
        orderEmptyEl.hidden = false;
        checkoutBtn.disabled = true;
      } else {
        orderEmptyEl.hidden = true;
        checkoutBtn.disabled = false;
        orderListEl.innerHTML = cartLines(cart).map(posLineHTML).join("");

        orderListEl.querySelectorAll("[data-pos-inc]").forEach((b) => {
          b.addEventListener("click", () => { posAddToCart(Number(b.dataset.posInc), 1); renderOrder(); renderProducts(); });
        });
        orderListEl.querySelectorAll("[data-pos-dec]").forEach((b) => {
          b.addEventListener("click", () => {
            const id = Number(b.dataset.posDec);
            const line = getPosCart().find((l) => l.id === id);
            posSetQty(id, (line ? line.qty : 1) - 1);
            renderOrder(); renderProducts();
          });
        });
        orderListEl.querySelectorAll("[data-pos-qty]").forEach((inp) => {
          inp.addEventListener("change", () => { posSetQty(Number(inp.dataset.posQty), inp.value); renderOrder(); renderProducts(); });
        });
        orderListEl.querySelectorAll("[data-pos-remove]").forEach((b) => {
          b.addEventListener("click", () => { posRemoveFromCart(Number(b.dataset.posRemove)); renderOrder(); renderProducts(); });
        });
      }

      subtotalEl.textContent = fmtBaht(subtotal);
      if (discount) {
        discountRowEl.hidden = false;
        discountAmountEl.textContent = "\u2212" + fmtBaht(discountAmount);
        discountInput.value = discount.code;
      } else {
        discountRowEl.hidden = true;
      }
      totalEl.textContent = fmtBaht(total);
    }

    // Search
    searchInput.addEventListener("input", () => {
      currentSearch = searchInput.value.trim().toLowerCase();
      renderProducts();
    });

    // Filter
    filterBar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter__btn");
      if (!btn) return;
      filterBar.querySelectorAll(".filter__btn").forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
      currentFilter = btn.dataset.filter;
      renderProducts();
    });

    // Discount
    applyBtn.addEventListener("click", () => {
      const code = (discountInput.value || "").trim().toUpperCase();
      if (!code) return;
      if (code === VALID_DISCOUNT.code) {
        setDiscount(VALID_DISCOUNT);
        discountMsg.textContent = "Discount applied: " + VALID_DISCOUNT.percent + "% off";
        discountMsg.className = "discount-msg is-success";
      } else {
        setDiscount(null);
        discountMsg.textContent = "Invalid discount code.";
        discountMsg.className = "discount-msg is-error";
      }
      renderOrder();
    });

    // Payment method
    payButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        payButtons.forEach((b) => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        selectedPayment = btn.dataset.pay;
      });
    });
    if (payButtons.length) payButtons[0].classList.add("is-selected");

    // Checkout — ตัดสต๊อกที่ Supabase ผ่าน RPC create_sale (atomic)
    checkoutBtn.addEventListener("click", async () => {
      const { cart, discount } = currentTotals();
      if (cart.length === 0) return;

      const lines = cartLines(cart);

      // ตรวจเบื้องต้นจากแคชก่อน เพื่อบอกผู้ใช้ได้ทันทีโดยไม่ต้องยิง network
      for (const line of lines) {
        if (line.qty > getStock(line.product.slug)) {
          discountMsg.textContent = "สต๊อกไม่พอสำหรับ " + line.product.name;
          discountMsg.className = "discount-msg is-error";
          return;
        }
      }

      checkoutBtn.disabled = true;
      const originalLabel = checkoutBtn.textContent;
      checkoutBtn.textContent = "Processing...";

      const result = await commitSale(lines, selectedPayment, discount);

      checkoutBtn.textContent = originalLabel;

      if (!result.ok) {
        // สต๊อกที่ฐานข้อมูลอาจถูกตัดไปแล้วจากเครื่องอื่น — รีเฟรชให้ตรงจริง
        discountMsg.textContent = result.message;
        discountMsg.className = "discount-msg is-error";
        await loadStock();
        renderProducts();
        renderOrder();
        return;
      }

      const order = result.order;
      localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
      savePosCart([]);
      setDiscount(null);
      discountMsg.textContent = "";
      discountMsg.className = "discount-msg";

      // แจ้งเตือน Telegram — ไม่ await เพื่อไม่ให้หน้าจอค้างรอ network
      // ถ้าส่งไม่สำเร็จก็ไม่กระทบการขายที่บันทึกไปแล้ว
      sendTelegramNotification(order).then(function (r) {
        setTelegramBadge(r.skipped ? "off" : r.ok ? "sent" : "failed");
      });

      document.getElementById("posSuccessOrderNumber").textContent = "Order Number: " + order.orderNumber;
      document.getElementById("posSuccessTotal").textContent = "Total: " + fmtBaht(order.total);
      mainPanel.hidden = true;
      successEl.hidden = false;

      await loadSales();
      renderDashboard();
      renderProducts();
      renderOrder();
    });

    if (newSaleBtn) {
      newSaleBtn.addEventListener("click", () => {
        successEl.hidden = true;
        mainPanel.hidden = false;
      });
    }

    // โหลดข้อมูลจริงจาก Supabase ก่อน แล้วค่อย render
    renderProducts();
    renderOrder();
    renderDashboard();
    setBackendBadge("loading");

    Promise.all([loadStock(), loadSales()]).then(() => {
      setBackendBadge(usingSupabase ? "online" : "offline");
      renderDashboard();
      renderProducts();
      renderOrder();
    });
  }

  /* ---------------------------------------------------------
     ป้ายบอกสถานะการเชื่อมต่อฐานข้อมูลบนหน้า POS
     --------------------------------------------------------- */
  /* สถานะการส่งแจ้งเตือน Telegram บนหน้าจอ Payment Successful */
  function setTelegramBadge(state) {
    const el = document.getElementById("posTelegramStatus");
    if (!el) return;
    if (state === "sent") {
      el.className = "stock-pill stock-pill--in";
      el.textContent = "\u{1F4F2} \u0E41\u0E08\u0E49\u0E07\u0E40\u0E15\u0E37\u0E2D\u0E19 Telegram \u0E41\u0E25\u0E49\u0E27";
      el.hidden = false;
    } else if (state === "failed") {
      el.className = "stock-pill stock-pill--low";
      el.textContent = "\u{1F4F2} \u0E2A\u0E48\u0E07\u0E41\u0E08\u0E49\u0E07\u0E40\u0E15\u0E37\u0E2D\u0E19\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08 (\u0E1A\u0E34\u0E25\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27)";
      el.hidden = false;
    } else {
      el.hidden = true;
    }
  }

  function setBackendBadge(state) {
    const el = document.getElementById("posBackendBadge");
    if (!el) return;
    if (state === "loading") {
      el.className = "stock-pill stock-pill--in";
      el.textContent = "Connecting...";
    } else if (state === "online") {
      el.className = "stock-pill stock-pill--in";
      el.textContent = "Supabase Connected";
    } else {
      el.className = "stock-pill stock-pill--low";
      el.textContent = "Offline Mode (localStorage)";
    }
  }

  /* ---------------------------------------------------------
     PAGE: inventory
     --------------------------------------------------------- */
  function initInventory() {
    const tbody = document.getElementById("invBody");
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--ink-45);">Loading...</td></tr>';
    loadStock().then(renderInventoryTable);
  }

  function renderInventoryTable() {
    const tbody = document.getElementById("invBody");
    if (!tbody) return;
    const inv = getInventory();
    tbody.innerHTML = PRODUCTS.map((p) => {
      const stock = inv[p.slug] != null ? inv[p.slug] : 0;
      const status = stockStatus(stock);
      return `
        <tr>
          <td>${p.name}</td>
          <td>${p.style}</td>
          <td>${fmtBaht(p.price)}</td>
          <td>${stock}</td>
          <td><span class="stock-pill stock-pill--${status}">${stockLabel(status)}</span></td>
        </tr>`;
    }).join("");
  }

  /* ---------------------------------------------------------
     PAGE: sales — sales history
     --------------------------------------------------------- */
  function initSales() {
    const tbody = document.getElementById("salesBody");
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--ink-45);">Loading...</td></tr>';
    loadSales().then(renderSalesTable);
  }

  function renderSalesTable() {
    const tbody = document.getElementById("salesBody");
    if (!tbody) return;
    const emptyState = document.getElementById("salesEmpty");
    const tableWrap = document.getElementById("salesTableWrap");
    const sales = getSales();

    if (sales.length === 0) {
      if (tableWrap) tableWrap.hidden = true;
      if (emptyState) emptyState.hidden = false;
      return;
    }
    if (tableWrap) tableWrap.hidden = false;
    if (emptyState) emptyState.hidden = true;

    tbody.innerHTML = sales.map((s) => {
      const itemsSummary = s.items.map((it) => it.name + " \u00d7" + it.qty).join(", ");
      const dateStr = new Date(s.date).toLocaleString("en-GB", {
        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
      });
      return `
        <tr>
          <td>${s.orderNumber}</td>
          <td>${dateStr}</td>
          <td>${itemsSummary}</td>
          <td>${s.paymentMethod || "\u2013"}</td>
          <td>${fmtBaht(s.total)}</td>
          <td><span class="stock-pill stock-pill--in">${s.status || "Completed"}</span></td>
        </tr>`;
    }).join("");
  }

  /* ---------------------------------------------------------
     Boot
     --------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    const page = document.body.dataset.page;
    if (page === "home") initHome();
    if (page === "collection") initCollection();
    if (page === "product") initProduct();
    if (page === "cart") initCart();
    if (page === "order") initCheckout();
    if (page === "receipt") initReceipt();
    if (page === "pos") initPOS();
    if (page === "inventory") initInventory();
    if (page === "sales") initSales();
  });
})();
