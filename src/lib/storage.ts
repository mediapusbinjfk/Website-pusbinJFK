import { createClient } from "@supabase/supabase-js";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

// Supabase client instance if credentials exist
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  (process.env.DATABASE_URL?.includes("supabase.co")
    ? `https://${process.env.DATABASE_URL.split("@")[1]?.split(".")[0]?.replace("aws-0-", "") || ""}.supabase.co`
    : undefined);

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export interface UploadResult {
  url: string;
  fileName: string;
  fileSize: string;
  storageType: "supabase" | "local";
}

// ─── Security Configuration: Allowed Extensions & MIME Types ───────────────
const ALLOWED_EXTENSIONS = new Set([
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
]);

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

// Maximum file size: 25 MB
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Validates file extension, MIME type, and size
 */
export function validateUploadedFile(file: File): { valid: boolean; error?: string } {
  if (!file || typeof file.size !== "number") {
    return { valid: false, error: "File tidak valid atau kosong." };
  }

  // 1. Size Validation
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `Ukuran file melebihi batas maksimum (${formatBytes(MAX_FILE_SIZE_BYTES)}).`,
    };
  }

  if (file.size === 0) {
    return { valid: false, error: "Ukuran file tidak boleh kosong (0 bytes)." };
  }

  // 2. Extension Validation
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return {
      valid: false,
      error: `Tipe file dengan ekstensi "${ext}" tidak diizinkan demi keamanan. Hanya file dokumen (PDF, Word, Excel) dan gambar (JPG, PNG) yang diperbolehkan.`,
    };
  }

  // 3. MIME Type Validation (if provided)
  if (file.type && !ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
    return {
      valid: false,
      error: `Format MIME type "${file.type}" tidak diizinkan.`,
    };
  }

  return { valid: true };
}

/**
 * Upload file to Supabase Storage (if configured) or local /public/uploads/ (fallback)
 * Hardened with UUID filename generation and path sanitization.
 */
export async function uploadFile(
  file: File,
  folder: "produk-hukum" | "dokumentasi" | "dokumen" = "produk-hukum",
  bucketName = "bahan-dokumen"
): Promise<UploadResult> {
  // Validate file integrity
  const validation = validateUploadedFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || "File gagal divalidasi.");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate cryptographically random filename to completely prevent directory traversal and collisions
  const safeExt = path.extname(file.name).toLowerCase();
  const uniqueName = `${crypto.randomUUID()}${safeExt}`;
  const fileSizeStr = formatBytes(file.size);

  // 1. Try Supabase Storage if configured
  if (supabase) {
    try {
      const storagePath = `${folder}/${uniqueName}`;
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(storagePath, buffer, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(storagePath);

        return {
          url: publicUrlData.publicUrl,
          fileName: file.name,
          fileSize: fileSizeStr,
          storageType: "supabase",
        };
      }
      console.warn("Supabase storage upload error, falling back to local storage:", error?.message);
    } catch (err) {
      console.warn("Supabase upload exception, falling back to local storage:", err);
    }
  }

  // 2. Fallback to local filesystem in public/uploads/
  const uploadsBaseDir = path.resolve(process.cwd(), "public", "uploads");
  const targetDir = path.resolve(uploadsBaseDir, folder);

  // Verify target directory strictly stays within uploadsBaseDir
  if (!targetDir.startsWith(uploadsBaseDir)) {
    throw new Error("Akses direktori ditolak: Path traversal terdeteksi.");
  }

  await fs.mkdir(targetDir, { recursive: true });

  const filePath = path.resolve(targetDir, uniqueName);
  if (!filePath.startsWith(targetDir)) {
    throw new Error("Akses direktori ditolak: Path traversal terdeteksi.");
  }

  await fs.writeFile(filePath, buffer);

  const publicUrl = `/uploads/${folder}/${uniqueName}`;

  return {
    url: publicUrl,
    fileName: file.name,
    fileSize: fileSizeStr,
    storageType: "local",
  };
}

/**
 * Delete a file from storage
 * Hardened against Path Traversal and Arbitrary File Deletion.
 */
export async function deleteFile(
  fileUrl: string,
  bucketName = "bahan-dokumen"
): Promise<boolean> {
  try {
    if (!fileUrl || typeof fileUrl !== "string") return false;

    // Local file deletion
    if (fileUrl.startsWith("/uploads/")) {
      const uploadsBaseDir = path.resolve(process.cwd(), "public", "uploads");
      // Strip leading /uploads/ to prevent directory traversal
      const relativePart = fileUrl.replace(/^\/uploads\//, "");
      const resolvedPath = path.resolve(uploadsBaseDir, relativePart);

      // Verify that the file being deleted is strictly inside public/uploads
      if (!resolvedPath.startsWith(uploadsBaseDir)) {
        console.warn(`[Security Warning] Percobaan Path Traversal pada deleteFile: ${fileUrl}`);
        return false;
      }

      await fs.unlink(resolvedPath);
      return true;
    }

    // Supabase storage deletion
    if (supabase && fileUrl.includes("supabase.co/storage")) {
      const parts = fileUrl.split(`${bucketName}/`);
      if (parts.length > 1) {
        const filePath = parts[1].split("?")[0];
        await supabase.storage.from(bucketName).remove([filePath]);
        return true;
      }
    }
  } catch (err) {
    console.error("Error deleting file:", err);
  }
  return false;
}
