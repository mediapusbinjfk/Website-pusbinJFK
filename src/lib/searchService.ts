import { SearchResultItem } from "@/types";
import rawProdukHukum from "@/data/produkHukumData.json";
import rawDokumentasi from "@/data/dokumentasiData.json";

interface RawProdukHukumItem {
  id: string;
  title: string;
  documentNumber?: string | null;
  type?: string;
  year?: number;
  description?: string | null;
  fileUrl?: string;
}

interface RawDokumentasiItem {
  id: string;
  title: string;
  date?: string;
  location?: string | null;
  category?: string;
  description?: string | null;
}

const INSTITUTIONAL_PAGES = [
  {
    id: "page-tentang",
    title: "Tentang Pusat Pembinaan JF Kebencanaan",
    category: "Profil Institusi",
    type: "halaman" as const,
    url: "/profil/tentang-unit",
    description: "Kedudukan organisasi, pengantar profil, visi, misi, dan ruang lingkup pembinaan aparatur kebencanaan.",
    keywords: ["tentang", "profil", "visi", "misi", "lingkup", "pusbin", "bnpb", "tujuan"],
  },
  {
    id: "page-sejarah",
    title: "Sejarah & Kilas Balik Pembentukan Unit",
    category: "Profil Institusi",
    type: "halaman" as const,
    url: "/profil/sejarah",
    description: "Kronologi transformasi dan tonggak sejarah pembinaan jabatan fungsional kebencanaan sejak 2019 hingga 2026.",
    keywords: ["sejarah", "latar belakang", "kronologi", "2019", "transformasi", "pembentukan"],
  },
  {
    id: "page-struktur",
    title: "Struktur Organisasi & Pimpinan Lembaga",
    category: "Profil Institusi",
    type: "halaman" as const,
    url: "/profil/struktur-organisasi",
    description: "Hierarki kelembagaan dipimpin Kepala BNPB Mayjen TNI Kristomei Sianturi hingga kelompok kerja teknis pembina.",
    keywords: ["struktur", "organisasi", "bagan", "pimpinan", "kepala bnpb", "kristomei", "kapus", "tata usaha", "hierarki"],
  },
  {
    id: "page-tusi",
    title: "Tugas Pokok & Fungsi Pembinaan JF",
    category: "Profil Institusi",
    type: "halaman" as const,
    url: "/profil/tugas-fungsi",
    description: "Rincian tugas pokok, mandat regulasi, standardisasi kompetensi, dan fungsi pembinaan aparatur penata & analis kebencanaan.",
    keywords: ["tugas", "fungsi", "tusi", "wewenang", "tanggung jawab", "mandat", "standar kompetensi", "penata", "analis"],
  },
  {
    id: "page-dasar-hukum",
    title: "Dasar Hukum & Landasan Regulasi",
    category: "Profil Institusi",
    type: "halaman" as const,
    url: "/profil/dasar-hukum",
    description: "Undang-Undang Nomor 24/2007, UU ASN Nomor 20/2023, PermenPANRB Nomor 1/2023, dan Peraturan BNPB.",
    keywords: ["dasar hukum", "undang-undang", "uu", "permenpan", "perpres", "regulasi", "peraturan bnpb", "landasan"],
  },
  {
    id: "page-layanan-konsultasi",
    title: "Layanan Konsultasi Jabatan Fungsional",
    category: "Layanan Kedinasan",
    type: "halaman" as const,
    url: "/layanan/konsultasi",
    description: "Pengajuan konsultasi karir, uji kompetensi (UKOM), angka kredit konversi, dan formasi JF daring (Zoom) atau tatap muka di Graha BNPB.",
    keywords: ["konsultasi", "jadwal", "daftar", "zoom", "tatap muka", "ukom", "uji kompetensi", "angka kredit", "formasi", "pak"],
  },
  {
    id: "page-produk-hukum",
    title: "Produk Hukum & Dokumen Regulasi",
    category: "Layanan Kedinasan",
    type: "halaman" as const,
    url: "/layanan/produk-hukum",
    description: "Repositori resmi peraturan, keputusan, surat edaran, pedoman, juknis, dan standar kompetensi JF Kebencanaan.",
    keywords: ["produk hukum", "peraturan", "keputusan", "surat edaran", "pedoman", "juknis", "petunjuk teknis", "standar", "download", "pdf"],
  },
  {
    id: "page-persuratan",
    title: "Persuratan Kedinasan & Sistem SRIKANDI",
    category: "Layanan Kedinasan",
    type: "halaman" as const,
    url: "/layanan/persuratan-terintegrasi",
    description: "Informasi alur tata naskah dinas elektronik dan panduan persuratan terintegrasi sistem SRIKANDI nasional ANRI.",
    keywords: ["surat", "persuratan", "srikandi", "naskah dinas", "anri", "arsip", "pengajuan surat", "tata naskah"],
  },
  {
    id: "page-dokumentasi",
    title: "Dokumentasi & Publikasi Kegiatan",
    category: "Informasi Publik",
    type: "halaman" as const,
    url: "/informasi-publik/dokumentasi-kegiatan",
    description: "Galeri foto kegiatan resmi, rapat koordinasi pembinaan, bimbingan teknis, dan sosialisasi nasional aparatur kebencanaan.",
    keywords: ["dokumentasi", "kegiatan", "galeri", "foto", "publikasi", "rakor", "bimtek", "sosialisasi", "berita", "informasi"],
  },
  {
    id: "page-privasi",
    title: "Kebijakan Privasi & Perlindungan Data Pribadi",
    category: "Informasi Publik",
    type: "halaman" as const,
    url: "/kebijakan-privasi",
    description: "Standar kepatuhan perlindungan data pribadi pemohon konsultasi sesuai Undang-Undang Nomor 27 Tahun 2022 (UU PDP).",
    keywords: ["kebijakan privasi", "privasi", "pdp", "keamanan data", "uu 27", "perlindungan data"],
  },
];

export function globalSearch(query: string): SearchResultItem[] {
  if (!query || query.trim().length < 2) return [];

  const q = query.toLowerCase().trim();
  const results: SearchResultItem[] = [];

  // 1. Pencarian Halaman & Modul Resmi Portal
  INSTITUTIONAL_PAGES.forEach((page) => {
    const match =
      page.title.toLowerCase().includes(q) ||
      page.description.toLowerCase().includes(q) ||
      page.keywords.some((k) => k.includes(q) || q.includes(k));

    if (match) {
      results.push({
        id: page.id,
        title: page.title,
        category: page.category,
        type: page.type,
        url: page.url,
        description: page.description,
      });
    }
  });

  // 2. Pencarian Data Riil Produk Hukum (dari repositori lokal/database)
  const legalProducts = (Array.isArray(rawProdukHukum) ? rawProdukHukum : []) as RawProdukHukumItem[];
  legalProducts.forEach((doc) => {
    const titleMatch = doc.title && doc.title.toLowerCase().includes(q);
    const numMatch = doc.documentNumber && doc.documentNumber.toLowerCase().includes(q);
    const descMatch = doc.description && doc.description.toLowerCase().includes(q);
    const typeMatch = doc.type && doc.type.toLowerCase().includes(q);

    if (titleMatch || numMatch || descMatch || typeMatch) {
      results.push({
        id: `ph-${doc.id}`,
        title: doc.documentNumber ? `${doc.documentNumber} - ${doc.title}` : doc.title,
        category: `Produk Hukum (${doc.type || "Regulasi"})`,
        type: "dokumen",
        url: `/layanan/produk-hukum`,
        date: doc.year ? `Tahun ${doc.year}` : undefined,
        description: doc.description || undefined,
      });
    }
  });

  // 3. Pencarian Data Riil Publikasi & Dokumentasi Kegiatan
  const documentationItems = (Array.isArray(rawDokumentasi) ? rawDokumentasi : []) as RawDokumentasiItem[];
  documentationItems.forEach((act) => {
    const titleMatch = act.title && act.title.toLowerCase().includes(q);
    const locMatch = act.location && act.location.toLowerCase().includes(q);
    const descMatch = act.description && act.description.toLowerCase().includes(q);
    const catMatch = act.category && act.category.toLowerCase().includes(q);

    if (titleMatch || locMatch || descMatch || catMatch) {
      results.push({
        id: `act-${act.id}`,
        title: act.title,
        category: `Publikasi (${act.category || "Kegiatan"})`,
        type: "kegiatan",
        url: `/informasi-publik/dokumentasi-kegiatan`,
        date: act.date,
        description: act.location ? `${act.location} • ${act.description || ""}` : act.description || undefined,
      });
    }
  });

  return results;
}
