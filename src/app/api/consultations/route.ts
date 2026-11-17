import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

// POST /api/consultations (Public endpoint for submitting consultation requests)
export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting defense
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";
    const limiter = rateLimit(`consultation_${ip}`, 10, 60 * 1000); // 10 requests / minute max
    if (!limiter.success) {
      return NextResponse.json(
        { success: false, error: "Terlalu banyak permintaan. Silakan coba lagi dalam beberapa saat." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Honeypot anti-spam trap (bot otomatis mengisi kolom tersembunyi ini)
    if (body.website_url) {
      return NextResponse.json(
        {
          success: true,
          message: "Pengajuan konsultasi berhasil dikirim dan tersimpan di database.",
          data: { id: `KNS-${Date.now().toString(36).toUpperCase()}` },
        },
        { status: 201 }
      );
    }

    const name = String(body.name || "").trim().slice(0, 150);
    const whatsapp = String(body.whatsapp || "").trim().slice(0, 30);
    const email = body.email ? String(body.email).trim().slice(0, 100) : null;
    const institution = String(body.institution || "").trim().slice(0, 200);
    const position = String(body.position || "").trim().slice(0, 150);
    const consultationMethod = String(body.consultationMethod || "online").trim().slice(0, 50);
    const topic = String(body.topic || "").trim().slice(0, 300);
    const notes = body.notes ? String(body.notes).trim().slice(0, 2000) : null;
    const estimatedDateStr = body.estimatedDate ? String(body.estimatedDate).trim() : null;
    const estimatedTime = body.estimatedTime ? String(body.estimatedTime).trim().slice(0, 50) : null;

    if (!name || !whatsapp || !institution || !position || !topic || !estimatedDateStr) {
      return NextResponse.json(
        { success: false, error: "Harap lengkapi semua kolom wajib." },
        { status: 400 }
      );
    }

    const parsedDate = new Date(estimatedDateStr);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { success: false, error: "Format tanggal tidak valid." },
        { status: 400 }
      );
    }

    // Insert into Supabase PostgreSQL
    const created = await prisma.consultation.create({
      data: {
        name,
        whatsapp,
        email,
        institution,
        position,
        consultationMethod,
        topic,
        notes,
        estimatedDate: parsedDate,
        estimatedTime,
        status: "menunggu",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Pengajuan konsultasi berhasil dikirim dan tersimpan di database.",
        data: created,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[POST /api/consultations] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan pengajuan konsultasi ke server." },
      { status: 500 }
    );
  }
}

// GET /api/consultations (Admin only: fetch list of consultations)
export async function GET(request: NextRequest) {
  try {
    const session = verifyAdminSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak: Autentikasi sesi admin diperlukan." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;

    const where: any = {};
    if (status && status !== "semua") {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { institution: { contains: search, mode: "insensitive" } },
        { topic: { contains: search, mode: "insensitive" } },
        { whatsapp: { contains: search, mode: "insensitive" } },
      ];
    }

    const items = await prisma.consultation.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: items,
      total: items.length,
    });
  } catch (error: any) {
    console.error("[GET /api/consultations] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat data konsultasi." },
      { status: 500 }
    );
  }
}
