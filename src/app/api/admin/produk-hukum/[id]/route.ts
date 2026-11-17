import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFile } from "@/lib/storage";
import { verifyAdminSession } from "@/lib/auth";
import { deleteProdukHukum } from "@/lib/produkHukumService";

const ALLOWED_TYPES = new Set([
  "Peraturan",
  "Keputusan",
  "Surat Edaran",
  "Pedoman",
  "Petunjuk Teknis",
  "Instruksi",
  "Standar",
  "Lainnya",
]);

const ALLOWED_STATUSES = new Set(["published", "draft", "archived"]);

// GET /api/admin/produk-hukum/[id]
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
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "ID dokumen tidak valid." },
        { status: 400 }
      );
    }

    const item = await prisma.produkHukum.findUnique({ where: { id } });

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Produk hukum tidak ditemukan." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("[GET /api/admin/produk-hukum/[id]] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat detail produk hukum." },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/produk-hukum/[id]
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
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "ID dokumen tidak valid." },
        { status: 400 }
      );
    }

    const existing = await prisma.produkHukum.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Produk hukum tidak ditemukan." },
        { status: 404 }
      );
    }

    // Hapus file fisik secara aman melalui storage.ts yang sudah diproteksi path traversal
    if (existing.fileUrl) {
      await deleteFile(existing.fileUrl);
    }

    // Hapus dari persistent storage & Prisma
    await deleteProdukHukum(id);

    return NextResponse.json({
      success: true,
      message: "Produk hukum berhasil dihapus.",
    });
  } catch (error) {
    console.error("[DELETE /api/admin/produk-hukum/[id]] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus produk hukum." },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/produk-hukum/[id] (Update status atau metadata)
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
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "ID dokumen tidak valid." },
        { status: 400 }
      );
    }

    const body = await request.json();
    const updateData: any = {};

    if (body.title && typeof body.title === "string") {
      updateData.title = body.title.trim().slice(0, 300);
    }
    if (body.documentNumber !== undefined) {
      updateData.documentNumber = body.documentNumber ? String(body.documentNumber).trim().slice(0, 100) : null;
    }
    if (body.type && ALLOWED_TYPES.has(body.type)) {
      updateData.type = body.type;
    }
    if (body.year) {
      const parsedYear = parseInt(body.year, 10);
      if (!isNaN(parsedYear) && parsedYear >= 1945 && parsedYear <= 2100) {
        updateData.year = parsedYear;
      }
    }
    if (body.description !== undefined) {
      updateData.description = body.description ? String(body.description).trim().slice(0, 2000) : null;
    }
    if (body.status && ALLOWED_STATUSES.has(body.status)) {
      updateData.status = body.status;
    }

    const updated = await prisma.produkHukum.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[PATCH /api/admin/produk-hukum/[id]] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui data produk hukum." },
      { status: 500 }
    );
  }
}
