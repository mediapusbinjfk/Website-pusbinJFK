import { NextRequest, NextResponse } from "next/server";
import { getProdukHukumList } from "@/lib/produkHukumService";

export const dynamic = "force-dynamic";

// GET /api/produk-hukum (Public endpoint)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const type = searchParams.get("type") || undefined;
    const yearStr = searchParams.get("year");
    const year = yearStr && yearStr !== "Semua Tahun" && yearStr !== "semua" ? parseInt(yearStr, 10) : undefined;

    const items = await getProdukHukumList({
      search,
      type,
      year: isNaN(year as number) ? undefined : year,
      status: "published",
    });

    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    console.error("GET /api/produk-hukum error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat produk hukum." },
      { status: 500 }
    );
  }
}
