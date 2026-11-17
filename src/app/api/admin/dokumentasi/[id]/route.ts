import { NextRequest, NextResponse } from "next/server";
import { getDokumentasiById, deleteDokumentasi } from "@/lib/dokumentasiService";
import { verifyAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = verifyAdminSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak: Autentikasi sesi admin diperlukan." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const item = await getDokumentasiById(id);
    if (!item) {
      return NextResponse.json(
        { success: false, error: "Data dokumentasi tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("[GET /api/admin/dokumentasi/[id]] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat detail dokumentasi." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = verifyAdminSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak: Autentikasi sesi admin diperlukan." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const deleted = await deleteDokumentasi(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Data dokumentasi tidak ditemukan atau sudah terhapus." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Dokumentasi dan file terkait berhasil dihapus.",
    });
  } catch (error) {
    console.error("[DELETE /api/admin/dokumentasi/[id]] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus data dokumentasi." },
      { status: 500 }
    );
  }
}

