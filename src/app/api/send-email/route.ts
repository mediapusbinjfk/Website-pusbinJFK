import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { verifyAdminSession } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication Check (Prevent Open Relay Abuse)
    const session = verifyAdminSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak: Layanan pengiriman email memerlukan autentikasi sesi admin." },
        { status: 401 }
      );
    }

    // 2. Rate Limiting Protection (Max 15 emails per minute per admin IP)
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const limiter = rateLimit(`email:${ip}`, 15, 60 * 1000);
    if (!limiter.success) {
      return NextResponse.json(
        { success: false, error: "Batas pengiriman email terlampaui. Silakan tunggu 1 menit." },
        { status: 429 }
      );
    }

    // 3. Input Validation & Sanitization
    const bodyJson = await request.json();
    const to = typeof bodyJson.to === "string" ? bodyJson.to.trim() : "";
    const subject = typeof bodyJson.subject === "string" ? bodyJson.subject.trim() : "";
    const body = typeof bodyJson.body === "string" ? bodyJson.body.trim() : "";

    if (!to || !EMAIL_REGEX.test(to)) {
      return NextResponse.json(
        { success: false, error: "Format alamat email tujuan tidak valid." },
        { status: 400 }
      );
    }

    if (!subject || subject.length > 250) {
      return NextResponse.json(
        { success: false, error: "Subjek email wajib diisi dan maksimal 250 karakter." },
        { status: 400 }
      );
    }

    if (!body || body.length > 25000) {
      return NextResponse.json(
        { success: false, error: "Isi email wajib diisi dan maksimal 25.000 karakter." },
        { status: 400 }
      );
    }

    // 4. Dispatch Email via Configured SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 25,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: `"Pusbin JF BNPB" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text: body,
    });

    return NextResponse.json({ success: true, message: "Email notifikasi berhasil dikirim." });
  } catch (error) {
    console.error("[POST /api/send-email] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses pengiriman email." },
      { status: 500 }
    );
  }
}
