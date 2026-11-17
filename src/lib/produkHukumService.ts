import fs from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { deleteFile } from "@/lib/storage";

export interface LegalProductData {
  id: string;
  title: string;
  documentNumber?: string | null;
  type: string;
  year: number;
  documentDate?: string | null;
  description?: string | null;
  fileName?: string | null;
  fileSize?: string | null;
  fileUrl: string;
  status: string;
  createdBy?: string | null;
  createdAt: string;
  updatedAt?: string;
}

const DATA_FILE_PATH = path.resolve(process.cwd(), "src", "data", "produkHukumData.json");

async function readLocalFile(): Promise<LegalProductData[]> {
  try {
    const raw = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // If file doesn't exist or error, return empty array
  }
  return [];
}

async function writeLocalFile(items: LegalProductData[]): Promise<void> {
  try {
    await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(items, null, 2), "utf-8");
  } catch (err) {
    console.warn("[ProdukHukumService] Failed to write local JSON backup:", err);
  }
}

/**
 * Mendapatkan daftar produk hukum langsung dari Database Supabase (via Prisma)
 */
export async function getProdukHukumList(filter?: {
  search?: string;
  type?: string;
  status?: string;
  year?: number;
}): Promise<LegalProductData[]> {
  const where: any = {};

  if (filter?.search) {
    where.OR = [
      { title: { contains: filter.search, mode: "insensitive" } },
      { documentNumber: { contains: filter.search, mode: "insensitive" } },
      { description: { contains: filter.search, mode: "insensitive" } },
    ];
  }

  if (filter?.type && filter.type !== "semua" && filter.type !== "Semua Kategori" && filter.type !== "Semua Jenis") {
    where.type = filter.type;
  }

  if (filter?.status && filter.status !== "semua") {
    where.status = filter.status;
  }

  if (filter?.year) {
    where.year = filter.year;
  }

  try {
    const dbItems = await prisma.produkHukum.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const mapped = dbItems.map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt ? item.updatedAt.toISOString() : undefined,
    }));

    // Update local mirror in background
    if (!filter?.search && (!filter?.type || filter.type === "semua") && (!filter?.status || filter.status === "semua")) {
      writeLocalFile(mapped);
    }

    return mapped;
  } catch (dbErr: any) {
    console.warn("[ProdukHukumService] Prisma fetch failed, using local mirror:", dbErr?.message);
    const localItems = await readLocalFile();

    return localItems.filter((item) => {
      if (filter?.search) {
        const q = filter.search.toLowerCase();
        const match =
          item.title.toLowerCase().includes(q) ||
          (item.documentNumber || "").toLowerCase().includes(q) ||
          (item.description || "").toLowerCase().includes(q);
        if (!match) return false;
      }
      if (filter?.type && filter.type !== "semua" && filter.type !== "Semua Kategori" && filter.type !== "Semua Jenis") {
        if (item.type !== filter.type) return false;
      }
      if (filter?.status && filter.status !== "semua") {
        if (item.status !== filter.status) return false;
      }
      if (filter?.year) {
        if (item.year !== filter.year) return false;
      }
      return true;
    });
  }
}

/**
 * Menyimpan produk hukum baru ke Database Supabase
 */
export async function createProdukHukum(data: {
  title: string;
  documentNumber?: string | null;
  type: string;
  year: number;
  documentDate?: string | null;
  description?: string | null;
  fileName?: string | null;
  fileSize?: string | null;
  fileUrl: string;
  status: string;
  createdBy?: string | null;
}): Promise<LegalProductData> {
  // 1. Simpan langsung ke Supabase
  let createdDbItem: any = null;
  try {
    createdDbItem = await prisma.produkHukum.create({
      data: {
        title: data.title,
        documentNumber: data.documentNumber || null,
        type: data.type,
        year: data.year,
        documentDate: data.documentDate || null,
        description: data.description || null,
        fileName: data.fileName || null,
        fileSize: data.fileSize || null,
        fileUrl: data.fileUrl,
        status: data.status,
        createdBy: data.createdBy || "Admin",
      },
    });
  } catch (dbErr: any) {
    console.warn("[ProdukHukumService] Prisma create error, saving to local fallback:", dbErr?.message);
  }

  const result: LegalProductData = createdDbItem
    ? {
        ...createdDbItem,
        createdAt: createdDbItem.createdAt.toISOString(),
        updatedAt: createdDbItem.updatedAt ? createdDbItem.updatedAt.toISOString() : undefined,
      }
    : {
        id: `DOC-${Date.now().toString(36).toUpperCase()}`,
        ...data,
        createdAt: new Date().toISOString(),
      };

  // 2. Simpan ke local mirror
  const localItems = await readLocalFile();
  localItems.unshift(result);
  await writeLocalFile(localItems);

  return result;
}

/**
 * Menghapus produk hukum dari Database Supabase dan Storage lokal
 */
export async function deleteProdukHukum(id: string): Promise<boolean> {
  let fileToDelete: string | null = null;

  try {
    const existing = await prisma.produkHukum.findUnique({ where: { id } });
    if (existing?.fileUrl) {
      fileToDelete = existing.fileUrl;
    }
    await prisma.produkHukum.delete({ where: { id } });
  } catch (dbErr: any) {
    console.warn("[ProdukHukumService] Prisma delete error, proceeding with local deletion:", dbErr?.message);
  }

  // Hapus dari local mirror
  const localItems = await readLocalFile();
  const target = localItems.find((i) => i.id === id);
  if (target?.fileUrl && !fileToDelete) {
    fileToDelete = target.fileUrl;
  }
  const filtered = localItems.filter((i) => i.id !== id);
  await writeLocalFile(filtered);

  // Hapus file fisik di storage jika lokal
  if (fileToDelete && fileToDelete.startsWith("/uploads/")) {
    await deleteFile(fileToDelete).catch(() => {});
  }

  return true;
}
