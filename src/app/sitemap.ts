import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pusbinjf.bnpb.go.id";

  const staticRoutes = [
    "",
    "/profil/sejarah",
    "/profil/tentang-unit",
    "/profil/tugas-fungsi",
    "/profil/struktur-organisasi",
    "/profil/dasar-hukum",
    "/layanan/konsultasi",
    "/layanan/persuratan-terintegrasi",
    "/layanan/produk-hukum",
    "/informasi-publik/dokumentasi-kegiatan",
    "/kebijakan-privasi",
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route.includes("produk-hukum") ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}

