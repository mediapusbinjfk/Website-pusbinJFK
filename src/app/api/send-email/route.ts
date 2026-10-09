import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { to, subject, body } = await request.json();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // Port 25 tidak pakai direct SSL
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Izinkan self-signed cert (server pemerintah)
      },
    });

    await transporter.sendMail({
      from: `"Pusbin JF BNPB" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text: body,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gagal kirim email:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengirim email" },
      { status: 500 }
    );
  }
}
