import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/storage";
import { verifyAdminSession } from "@/lib/auth";
import { getProdukHukumList, createProdukHukum, type LegalProductData } from "@/lib/produkHukumService";

export const dynamic = "force-dynamic";

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

// GET /api/admin/produk-hukum
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
    const search = (searchParams.get("search") || "").trim().slice(0, 100);
    const type = searchParams.get("type") || undefined;
    const status = searchParams.get("status") || undefined;
    const yearParam = searchParams.get("year");
    const year = yearParam && yearParam !== "semua" ? parseInt(yearParam, 10) : undefined;

    const items = await getProdukHukumList({
      search: search || undefined,
      type: type && ALLOWED_TYPES.has(type) ? type : undefined,
      status: status && ALLOWED_STATUSES.has(status) ? status : undefined,
      year: isNaN(year as number) ? undefined : year,
    });

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("[GET /api/admin/produk-hukum] Internal error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat daftar produk hukum." },
      { status: 500 }
    );
  }
}

// POST /api/admin/produk-hukum (Upload bahan & simpan permanen)
export async function POST(request: NextRequest) {
  try {
    const session = verifyAdminSession(request);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak: Autentikasi sesi admin diperlukan." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string)?.trim();
    const documentNumber = ((formData.get("documentNumber") as string) || "").trim() || null;
    const type = (formData.get("type") as string)?.trim();
    const yearStr = (formData.get("year") as string)?.trim();
    const documentDate = ((formData.get("documentDate") as string) || "").trim() || null;
    const description = ((formData.get("description") as string) || "").trim() || null;
    const status = ((formData.get("status") as string) || "published").trim();

    // Input Validation
    if (!title || title.length > 300) {
      return NextResponse.json(
        { success: false, error: "Judul wajib diisi dan maksimal 300 karakter." },
        { status: 400 }
      );
    }

    if (!type || !ALLOWED_TYPES.has(type)) {
      return NextResponse.json(
        { success: false, error: "Tipe dokumen tidak valid." },
        { status: 400 }
      );
    }

    if (!ALLOWED_STATUSES.has(status)) {
      return NextResponse.json(
        { success: false, error: "Status dokumen tidak valid." },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File dokumen wajib diunggah." },
        { status: 400 }
      );
    }

    // 1. Upload file ke local storage (/public/uploads/produk-hukum/)
    const uploadResult = await uploadFile(file, "produk-hukum");

    // 2. Simpan metadata ke persistent storage (JSON & PostgreSQL mirror)
    const currentYear = new Date().getFullYear();
    const parsedYear = parseInt(yearStr || "", 10);
    const year = !isNaN(parsedYear) && parsedYear >= 1945 && parsedYear <= 2100 ? parsedYear : currentYear;

    const created = await createProdukHukum({
      title,
      documentNumber,
      type,
      year,
      documentDate,
      description,
      fileName: uploadResult.fileName,
      fileSize: uploadResult.fileSize,
      fileUrl: uploadResult.url,
      status,
      createdBy: session.username || "Admin",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Produk hukum berhasil diunggah ke database Supabase.",
        data: created,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[POST /api/admin/produk-hukum] Internal error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message?.includes("keamanan") || error?.message?.includes("validasi")
          ? error.message
          : "Terjadi kesalahan saat memproses data dokumen.",
      },
      { status: 500 }
    );
  }
}
