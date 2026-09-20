/* ==========================================================
   LUMIÈRE JEWELRY — Telegram Notification configuration
   ----------------------------------------------------------
   แจ้งเตือนเข้า Telegram ทุกครั้งที่บันทึกการขายใน POS สำเร็จ

   ---------- วิธีสร้าง Bot (ใช้เวลา ~2 นาที) ----------
   1. เปิด Telegram ค้นหา  @BotFather  แล้วกด Start
   2. พิมพ์  /newbot
   3. ตั้งชื่อ Bot (เช่น LUMIERE POS) และ username ที่ลงท้ายด้วย bot
      (เช่น lumiere_pos_bot)
   4. BotFather จะส่ง token กลับมา หน้าตาแบบนี้:
      8123456789:AAH1a2B3c4D5e6F7g8H9i0J1k2L3m4N5o6P
      → เอามาใส่ TELEGRAM_BOT_TOKEN ข้างล่าง

   ---------- วิธีหา Chat ID ----------
   แบบ A (ส่งเข้าแชทส่วนตัว):
   1. ค้นหา Bot ที่เพิ่งสร้างใน Telegram แล้วกด Start (สำคัญมาก
      ถ้าไม่กด Start ก่อน Bot จะส่งข้อความหาเราไม่ได้)
   2. พิมพ์อะไรก็ได้ส่งให้ Bot 1 ข้อความ
   3. เปิด URL นี้ในเบราว์เซอร์ (แทน <TOKEN> ด้วย token ของคุณ):
      https://api.telegram.org/bot<TOKEN>/getUpdates
   4. หาค่า  "chat":{"id":123456789  → เลขนั้นคือ Chat ID

   แบบ B (ส่งเข้ากลุ่ม):
   1. เชิญ Bot เข้ากลุ่ม แล้วพิมพ์ข้อความในกลุ่ม 1 ครั้ง
   2. เปิด /getUpdates เหมือนเดิม
   3. Chat ID ของกลุ่มจะเป็นเลขติดลบ เช่น -1001234567890 (ใส่ลบด้วย)

   ---------- ⚠️ เรื่องความปลอดภัยที่ต้องรู้ ----------
   เว็บนี้เป็น static site ล้วน token ที่ใส่ในไฟล์นี้จึง "เปิดเผย
   ต่อสาธารณะ" ใครกด View Source ก็เห็น และเอา Bot ไปใช้ส่งข้อความได้
   - ใช้ได้กับงานการศึกษา/เดโม แต่ไม่ควรใช้กับร้านค้าจริง
   - ถ้า token หลุดให้พิมพ์ /revoke ที่ @BotFather เพื่อออก token ใหม่
   - ถ้าต้องการซ่อน token จริงๆ: deploy Edge Function ตามไฟล์
     telegram-edge-function.ts แล้วใส่ URL ที่ได้ในช่อง PROXY_URL
     ข้างล่าง ระบบจะส่งผ่าน Edge Function แทน และไม่ต้องใส่ token
     ในไฟล์นี้เลย
   ========================================================== */
window.LUMIERE_TELEGRAM = {
  // เปิด/ปิดการแจ้งเตือน
  ENABLED: true,

  // --- วิธีที่ 1: ยิงตรงจากเบราว์เซอร์ (ง่าย แต่ token เปิดเผย) ---
  TELEGRAM_BOT_TOKEN: "8831533132:AAF6nxzyvb444bGIxCetbVwekykDm4N2HT8",
  TELEGRAM_CHAT_ID: "8728594449",

  // --- วิธีที่ 2 (ปลอดภัยกว่า): ส่งผ่าน Supabase Edge Function ---
  // ใส่ URL เช่น https://xxxx.supabase.co/functions/v1/notify-telegram
  // ถ้ากรอกช่องนี้ ระบบจะใช้ช่องทางนี้แทน และไม่ใช้ token ด้านบน
  PROXY_URL: ""
};
