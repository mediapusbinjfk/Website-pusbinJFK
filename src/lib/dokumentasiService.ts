import fs from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { deleteFile } from "@/lib/storage";

export interface PhotoItem {
  url: string;
  caption?: string;
  isThumb?: boolean;
}

export interface DokumentasiItem {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  description: string;
  thumbnailUrl: string;
  status: "published" | "draft" | "Selesai" | "Akan Datang" | "Sedang Berlangsung";
  photoCount: number;
  createdBy: string;
  createdAt: string;
  photos: PhotoItem[];
}

const DATA_FILE_PATH = path.resolve(process.cwd(), "src", "data", "dokumentasiData.json");

const SEED_DATA: DokumentasiItem[] = [
  {
    id: "DOK-0001",
    title: "Rapat Koordinasi Nasional Pembinaan JF Kebencanaan 2026",
    category: "Dokumentasi Rapat",
    date: "2026-08-14",
    location: "Graha BNPB, Jakarta",
    description: "Sesi pleno pembukaan Rakornas Pembinaan JF Kebencanaan yang dihadiri pimpinan BNPB dan delegasi BPBD provinsi seluruh Indonesia.",
    thumbnailUrl: "/images/hero-bnpb.png",
    status: "published",
    photoCount: 1,
    createdBy: "Admin",
    createdAt: "2026-08-14T08:00:00.000Z",
    photos: [
      {
        url: "/images/hero-bnpb.png",
        caption: "Sesi pleno pembukaan Rakornas Pembinaan JF Kebencanaan",
        isThumb: true,
      },
    ],
  },
  {
    id: "DOK-0002",
    title: "Pelaksanaan Asesmen Uji Kompetensi Kenaikan Jenjang",
    category: "Pelatihan",
    date: "2026-09-10",
    location: "Pusdiklat PB Sentul, Bogor",
    description: "Para peserta ukom mengikuti simulasi studi kasus penyusunan rencana kontinjensi kebencanaan di Pusdiklat Sentul.",
    thumbnailUrl: "/images/beranda2.png.png",
    status: "published",
    photoCount: 1,
    createdBy: "Admin",
    createdAt: "2026-09-10T08:00:00.000Z",
    photos: [
      {
        url: "/images/beranda2.png.png",
        caption: "Simulasi studi kasus uji kompetensi di Sentul",
        isThumb: true,
      },
    ],
  },
  {
    id: "DOK-0003",
    title: "Workshop Portofolio Kinerja Digital & Penilaian PAK",
    category: "Pelatihan",
    date: "2026-07-20",
    location: "Ruang Rapat Lantai 12 BNPB",
    description: "Pendampingan langsung tata cara verifikasi dokumen bukti dukung pada portal digital manajemen talenta ASN.",
    thumbnailUrl: "/images/Beranda3.png",
    status: "published",
    photoCount: 1,
    createdBy: "Admin",
    createdAt: "2026-07-20T08:00:00.000Z",
    photos: [
      {
        url: "/images/Beranda3.png",
        caption: "Pendampingan tata cara verifikasi berkas PAK",
        isThumb: true,
      },
    ],
  },
  {
    id: "DOK-0004",
    title: "Kunjungan Kerja Supervisi Pembinaan JF ke Wilayah Jawa Timur",
    category: "Kunjungan Kerja",
    date: "2026-06-05",
    location: "Kantor BPBD Jawa Timur, Sidoarjo",
    description: "Diskusi sinkronisasi peta kebutuhan formasi jabatan fungsional bersama jajaran BPBD Provinsi Jawa Timur.",
    thumbnailUrl: "/images/beranda4.png",
    status: "published",
    photoCount: 1,
    createdBy: "Admin",
    createdAt: "2026-06-05T08:00:00.000Z",
    photos: [
      {
        url: "/images/beranda4.png",
        caption: "Koordinasi penetapan peta kebutuhan JF di BPBD Jatim",
        isThumb: true,
      },
    ],
  },
];

async function ensureDataFile(): Promise<DokumentasiItem[]> {
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // File doesn't exist yet or is invalid, initialize with seed
  }

  await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(SEED_DATA, null, 2), "utf-8");
  return SEED_DATA;
}

export async function getAllDokumentasi(filter?: {
  search?: string;
  category?: string;
  status?: string;
}): Promise<DokumentasiItem[]> {
  const items = await ensureDataFile();

  return items.filter((item) => {
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (filter?.category && filter.category !== "semua" && filter.category !== "Semua Kategori") {
      if (item.category !== filter.category) return false;
    }

    if (filter?.status && filter.status !== "semua") {
      if (item.status !== filter.status) return false;
    }

    return true;
  });
}

export async function getDokumentasiById(id: string): Promise<DokumentasiItem | null> {
  const items = await ensureDataFile();
  return items.find((item) => item.id === id) || null;
}

export async function saveDokumentasi(item: DokumentasiItem): Promise<DokumentasiItem> {
  const items = await ensureDataFile();
  const existingIdx = items.findIndex((i) => i.id === item.id);

  if (existingIdx >= 0) {
    items[existingIdx] = item;
  } else {
    items.unshift(item);
  }

  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(items, null, 2), "utf-8");

  // Attempt database sync silently without blocking
  try {
    await prisma.dokumentasiKegiatan.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        date: item.date,
        location: item.location,
        category: item.category,
        description: item.description,
        thumbnailUrl: item.thumbnailUrl,
        status: item.status,
      },
      create: {
        id: item.id,
        title: item.title,
        date: item.date,
        location: item.location,
        category: item.category,
        description: item.description,
        thumbnailUrl: item.thumbnailUrl,
        status: item.status,
        createdBy: item.createdBy,
      },
    });
  } catch (dbErr) {
    console.warn("[DokumentasiService] Database mirror skipped (offline/local):", dbErr);
  }

  return item;
}

export async function deleteDokumentasi(id: string): Promise<boolean> {
  const items = await ensureDataFile();
  const target = items.find((i) => i.id === id);
  if (!target) return false;

  const filtered = items.filter((i) => i.id !== id);
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(filtered, null, 2), "utf-8");

  // Delete associated photo files if stored locally in /uploads/
  if (target.photos && Array.isArray(target.photos)) {
    for (const photo of target.photos) {
      if (photo.url && photo.url.startsWith("/uploads/")) {
        await deleteFile(photo.url).catch(() => {});
      }
    }
  }

  // Attempt database deletion silently
  try {
    await prisma.dokumentasiKegiatan.delete({
      where: { id },
    });
  } catch (dbErr) {
    console.warn("[DokumentasiService] Database delete skipped (offline/local):", dbErr);
  }

  return true;
}

