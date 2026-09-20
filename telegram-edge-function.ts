// ==========================================================
// LUMIÈRE JEWELRY — Supabase Edge Function: notify-telegram
// ----------------------------------------------------------
// ใช้เมื่อไม่อยากให้ TELEGRAM_BOT_TOKEN โผล่ในโค้ดฝั่งเบราว์เซอร์
// (ถ้าไม่ต้องการ ข้ามไฟล์นี้ได้เลย ระบบยิงตรงก็ทำงานได้ปกติ)
//
// ---------- วิธี deploy ----------
// 1. ติดตั้ง Supabase CLI แล้ว login
//      npm i -g supabase
//      supabase login
//      supabase link --project-ref <project-ref ของคุณ>
//
// 2. สร้างโฟลเดอร์ฟังก์ชันแล้วเอาไฟล์นี้ไปวางเป็น index.ts
//      supabase functions new notify-telegram
//      (คัดลอกเนื้อหาไฟล์นี้ทับ supabase/functions/notify-telegram/index.ts)
//
// 3. ตั้งค่า secret (token จะอยู่ฝั่ง server เท่านั้น)
//      supabase secrets set TELEGRAM_BOT_TOKEN=8123456789:AAH...
//      supabase secrets set TELEGRAM_CHAT_ID=123456789
//
// 4. deploy แบบไม่ต้องยืนยันตัวตน (เว็บ static เรียกได้เลย)
//      supabase functions deploy notify-telegram --no-verify-jwt
//
// 5. เอา URL ที่ได้ไปใส่ PROXY_URL ใน telegram-config.js
//      https://<project-ref>.supabase.co/functions/v1/notify-telegram
// ==========================================================

const ALLOWED_ORIGINS = [
  // เพิ่ม/แก้โดเมนของคุณตรงนี้ได้
  "https://lumiere-jewelry4-88ek.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:5500",
];

function corsHeaders(origin: string | null) {
  const allow = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  const cors = corsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "Method not allowed" }), {
      status: 405,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");

  if (!TOKEN || !CHAT_ID) {
    return new Response(
      JSON.stringify({ ok: false, error: "ยังไม่ได้ตั้งค่า TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID" }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }

  try {
    const body = await req.json();
    const text = typeof body.text === "string" ? body.text : "";

    if (!text.trim()) {
      return new Response(JSON.stringify({ ok: false, error: "ไม่มีข้อความให้ส่ง" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const tgRes = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    const tgData = await tgRes.json();

    return new Response(JSON.stringify({ ok: tgRes.ok && tgData.ok !== false, result: tgData }), {
      status: tgRes.ok ? 200 : 502,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
