import { NextRequest, NextResponse } from "next/server";
import { getAllDokumentasi } from "@/lib/dokumentasiService";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;

    // Public only sees published or completed
    const items = await getAllDokumentasi({
      search,
      category,
    });

    const publicItems = items.filter(
      (item) => item.status === "published" || item.status === "Selesai"
    );

    return NextResponse.json({
      success: true,
      data: publicItems,
    });
  } catch (error) {
    console.error("[GET /api/dokumentasi] Error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat data publikasi." },
      { status: 500 }
    );
  }
}

