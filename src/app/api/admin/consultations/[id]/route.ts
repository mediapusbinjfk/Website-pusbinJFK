import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
    const item = await prisma.consultation.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json(
        { success: false, error: "Data pengajuan konsultasi tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("[GET /api/admin/consultations/[id]] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat detail konsultasi." },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
    const body = await request.json();

    const updateData: any = {};
    if (body.status) {
      updateData.status = String(body.status).trim();
    }
    if (body.notes !== undefined) {
      updateData.notes = body.notes ? String(body.notes).trim() : null;
    }
    if (body.estimatedTime !== undefined) {
      updateData.estimatedTime = body.estimatedTime ? String(body.estimatedTime).trim() : null;
    }
    if (body.estimatedDate) {
      const parsed = new Date(body.estimatedDate);
      if (!isNaN(parsed.getTime())) {
        updateData.estimatedDate = parsed;
      }
    }

    const updated = await prisma.consultation.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Status konsultasi berhasil diperbarui.",
      data: updated,
    });
  } catch (error) {
    console.error("[PATCH /api/admin/consultations/[id]] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui status konsultasi." },
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
    await prisma.consultation.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Data konsultasi berhasil dihapus dari database.",
    });
  } catch (error) {
    console.error("[DELETE /api/admin/consultations/[id]] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus data konsultasi." },
      { status: 500 }
    );
  }
}

