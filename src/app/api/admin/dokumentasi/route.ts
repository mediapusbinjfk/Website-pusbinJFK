import { NextRequest, NextResponse } from "next/server";
import { getAllDokumentasi, saveDokumentasi, type DokumentasiItem, type PhotoItem } from "@/lib/dokumentasiService";
import { uploadFile } from "@/lib/storage";
import { verifyAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/admin/dokumentasi
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
    const category = searchParams.get("category") || undefined;
    const status = searchParams.get("status") || undefined;

    const items = await getAllDokumentasi({
      search,
      category,
      status,
    });

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("[GET /api/admin/dokumentasi] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat data dokumentasi." },
      { status: 500 }
    );
  }
}

// POST /api/admin/dokumentasi (Upload file & simpan permanen)
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
    const title = (formData.get("title") as string)?.trim();
    const date = (formData.get("date") as string)?.trim() || new Date().toISOString().split("T")[0];
    const location = (formData.get("location") as string)?.trim() || "-";
    const category = (formData.get("category") as string)?.trim() || "Lainnya";
    const description = (formData.get("description") as string)?.trim() || "";
    const status = ((formData.get("status") as string) || "published").trim() as DokumentasiItem["status"];
    const thumbIndexStr = formData.get("thumbIndex") as string;
    const thumbIndex = thumbIndexStr !== null && thumbIndexStr !== undefined ? parseInt(thumbIndexStr, 10) : 0;

    if (!title) {
      return NextResponse.json(
        { success: false, error: "Judul kegiatan/publikasi wajib diisi." },
        { status: 400 }
      );
    }

    // Process photo uploads
    const files = formData.getAll("photos") as File[];
    const uploadedPhotos: PhotoItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file && typeof file.size === "number" && file.size > 0) {
        const uploadRes = await uploadFile(file, "dokumentasi");
        const caption = (formData.get(`caption_${i}`) as string) || "";
        const isThumb = i === thumbIndex || (uploadedPhotos.length === 0 && thumbIndex < 0);
        uploadedPhotos.push({
          url: uploadRes.url,
          caption,
          isThumb,
        });
      }
    }

    // Fallback if no new photos were attached, check for existing image url
    const fallbackImage = (formData.get("imageUrl") as string)?.trim();
    if (uploadedPhotos.length === 0 && fallbackImage) {
      uploadedPhotos.push({
        url: fallbackImage,
        caption: title,
        isThumb: true,
      });
    }

    const thumbnail =
      uploadedPhotos.find((p) => p.isThumb)?.url ||
      uploadedPhotos[0]?.url ||
      "/images/hero-bnpb.png";

    const newId = `DOK-${Date.now().toString(36).toUpperCase()}`;

    const newDoc: DokumentasiItem = {
      id: newId,
      title,
      date,
      location,
      category,
      description,
      thumbnailUrl: thumbnail,
      status,
      photoCount: uploadedPhotos.length,
      createdBy: session.username || "Admin",
      createdAt: new Date().toISOString(),
      photos: uploadedPhotos,
    };

    const saved = await saveDokumentasi(newDoc);

    return NextResponse.json(
      {
        success: true,
        message: "Publikasi dan dokumentasi berhasil disimpan secara permanen.",
        data: saved,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[POST /api/admin/dokumentasi] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Terjadi kesalahan saat memproses data publikasi.",
      },
      { status: 500 }
    );
  }
}

