/* ==========================================================
   LUMIÈRE JEWELRY — Supabase configuration
   ----------------------------------------------------------
   กรอกค่า 2 บรรทัดข้างล่างนี้จาก Supabase Dashboard:
   Project Settings → Data API  (หรือ API)

   SUPABASE_URL      = Project URL       เช่น https://abcdefgh.supabase.co
   SUPABASE_ANON_KEY = anon / public key (ขึ้นต้นด้วย eyJ...)

   ถ้ายังไม่กรอก ระบบ POS จะทำงานแบบ localStorage เหมือนเดิม
   (ไม่พัง ไม่ error) แล้วขึ้นป้ายเตือนว่า "Offline mode" ที่หน้า POS
   ========================================================== */
window.LUMIERE_SUPABASE = {
  SUPABASE_URL: "YOUR_SUPABASE_URL_HERE",
  SUPABASE_ANON_KEY: "YOUR_SUPABASE_ANON_KEY_HERE"
};
