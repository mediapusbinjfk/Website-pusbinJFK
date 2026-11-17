import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/admin/surat-dinas
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
    const search = searchParams.get("search") || undefined;
    const status = searchParams.get("status") || undefined;

    const where: any = {};
    if (status && status !== "semua") {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { perihal: { contains: search, mode: "insensitive" } },
        { pengajuNama: { contains: search, mode: "insensitive" } },
        { unitKerja: { contains: search, mode: "insensitive" } },
        { nomorSurat: { contains: search, mode: "insensitive" } },
      ];
    }

    const items = await prisma.pengajuanSurat.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    console.error("[GET /api/admin/surat-dinas] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat daftar naskah dinas." },
      { status: 500 }
    );
  }
}

// POST /api/admin/surat-dinas (Catat naskah dinas baru)
export async function POST(request: NextRequest) {
  try {
    const session = verifyAdminSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak: Autentikasi sesi admin diperlukan." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const nomorSurat = body.nomorSurat ? String(body.nomorSurat).trim().slice(0, 100) : null;
    const perihal = String(body.perihal || "").trim().slice(0, 300);
    const pengajuNama = String(body.pengajuNama || "").trim().slice(0, 150);
    const pengajuEmail = body.pengajuEmail ? String(body.pengajuEmail).trim().slice(0, 100) : null;
    const unitKerja = body.unitKerja ? String(body.unitKerja).trim().slice(0, 200) : null;
    const status = String(body.status || "pending").trim();

    if (!perihal || !pengajuNama) {
      return NextResponse.json(
        { success: false, error: "Perihal dan nama pengirim wajib diisi." },
        { status: 400 }
      );
    }

    const created = await prisma.pengajuanSurat.create({
      data: {
        nomorSurat,
        perihal,
        pengajuNama,
        pengajuEmail,
        unitKerja,
        status,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Naskah dinas berhasil dicatat.",
      data: created,
    });
  } catch (error: any) {
    console.error("[POST /api/admin/surat-dinas] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mencatat naskah dinas ke database." },
      { status: 500 }
    );
  }
}

