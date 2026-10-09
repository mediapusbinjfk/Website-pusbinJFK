// Test koneksi SMTP Zimbra BNPB
// Jalankan: node scratch/test-smtp.mjs

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "mail.bnpb.go.id",
  port: 25,
  secure: false, // Port 25 tidak pakai SSL langsung
  auth: {
    user: "PusbinJFKebencanaan@bnpb.go.id",
    pass: "Bnpb-t@ngguh!",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

console.log("🔌 Mencoba koneksi ke Zimbra SMTP mail.bnpb.go.id:25...");

try {
  await transporter.verify();
  console.log("✅ BERHASIL! Koneksi Zimbra SMTP aktif dan kredensial valid.");
  console.log("   Email siap dikirim dari: PusbinJFKebencanaan@bnpb.go.id");
} catch (error) {
  console.error("❌ GAGAL koneksi ke Zimbra SMTP.");
  console.error("   Error:", error.message);
  if (error.code) console.error("   Kode Error:", error.code);
}
