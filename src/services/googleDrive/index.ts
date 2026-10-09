/**
 * GoogleDriveService
 * 
 * Abstraksi untuk menyimpan file ke Google Drive.
 * Digunakan untuk: Produk Hukum (PDF), Dokumentasi (foto), Surat Dinas.
 * 
 * Struktur folder Drive:
 * JF BNPB (Root Folder)
 * ├── Produk Hukum
 * │   ├── Peraturan
 * │   ├── Keputusan
 * │   ├── Surat Edaran
 * │   └── Lainnya
 * ├── Dokumentasi
 * │   ├── 2026
 * │   └── 2027
 * └── Konsultasi
 *     └── Surat Dinas
 * 
 * PENTING: Service ini hanya boleh digunakan di server-side.
 */

import { ServiceResult } from "@/types/admin";
import type { LegalProductType } from "@/types/admin";

// ============================================================
// KONFIGURASI FOLDER DRIVE
// ============================================================
export const DRIVE_FOLDERS = {
  ROOT: process.env.GOOGLE_DRIVE_FOLDER_ID || "",
  PRODUK_HUKUM: process.env.GOOGLE_DRIVE_PRODUK_HUKUM_FOLDER_ID || "",
  DOKUMENTASI: process.env.GOOGLE_DRIVE_DOKUMENTASI_FOLDER_ID || "",
  KONSULTASI: process.env.GOOGLE_DRIVE_KONSULTASI_FOLDER_ID || "",
} as const;

// Subfolder untuk setiap jenis produk hukum
export const LEGAL_PRODUCT_SUBFOLDERS: Record<LegalProductType, string> = {
  Peraturan: "Peraturan",
  Keputusan: "Keputusan",
  "Surat Edaran": "Surat-Edaran",
  Pedoman: "Pedoman",
  "Petunjuk Teknis": "Petunjuk-Teknis",
  Instruksi: "Instruksi",
  Standar: "Standar",
  Lainnya: "Lainnya",
};

// ============================================================
// HASIL UPLOAD
// ============================================================
export interface UploadResult {
  fileId: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  mimeType: string;
  folderId: string;
}

// ============================================================
// FUNGSI PENAMAAN FILE OTOMATIS
// ============================================================

/**
 * Generate nama file untuk surat dinas konsultasi.
 * Format: KNS-XXXXXX_NAMA-PEMOHON_SURAT-DINAS_YYYY-MM-DD.pdf
 */
export function generateConsultationFileName(
  consultationId: string,
  applicantName: string,
  date: string
): string {
  const safeName = applicantName
    .toUpperCase()
    .replace(/\s+/g, "-")
    .replace(/[^A-Z0-9-]/g, "");
  return `${consultationId}_${safeName}_SURAT-DINAS_${date}.pdf`;
}

/**
 * Generate nama file untuk produk hukum.
 * Format: JENIS_NOMOR_TAHUN_JUDUL-SINGKAT.pdf
 */
export function generateLegalProductFileName(
  type: LegalProductType,
  documentNumber: string,
  year: number,
  titleSnippet: string
): string {
  const safeType = type.toUpperCase().replace(/\s+/g, "-");
  const safeNumber = documentNumber.replace(/[^A-Z0-9]/gi, "-").toUpperCase();
  const safeTitle = titleSnippet
    .substring(0, 30)
    .toUpperCase()
    .replace(/\s+/g, "-")
    .replace(/[^A-Z0-9-]/g, "");
  return `${safeType}_${safeNumber}_${year}_${safeTitle}.pdf`;
}

// ============================================================
// VALIDASI FILE
// ============================================================
export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validatePdfFile(
  file: File,
  maxSizeMB: number = 20
): FileValidationResult {
  const allowedMimeTypes = ["application/pdf"];
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (!allowedMimeTypes.includes(file.type)) {
    return { valid: false, error: "Hanya file PDF yang diperbolehkan." };
  }

  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Ukuran file melebihi batas maksimal ${maxSizeMB}MB.`,
    };
  }

  // Cek ekstensi file juga
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return { valid: false, error: "Ekstensi file harus .pdf" };
  }

  return { valid: true };
}

export function validateImageFile(
  file: File,
  maxSizeMB: number = 10
): FileValidationResult {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (!allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Hanya file JPG, PNG, atau WebP yang diperbolehkan.",
    };
  }

  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Ukuran file melebihi batas maksimal ${maxSizeMB}MB.`,
    };
  }

  return { valid: true };
}

// ============================================================
// GOOGLE DRIVE SERVICE CLASS
// ============================================================
class GoogleDriveService {
  private isConfigured(): boolean {
    return (
      !!process.env.GOOGLE_DRIVE_FOLDER_ID &&
      !!process.env.GOOGLE_CLIENT_EMAIL &&
      !!process.env.GOOGLE_PRIVATE_KEY
    );
  }

  /**
   * Upload file ke Google Drive.
   */
  async uploadFile(
    file: Buffer,
    fileName: string,
    mimeType: string,
    folderId: string
  ): Promise<ServiceResult<UploadResult>> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: "Google Drive belum dikonfigurasi. Isi GOOGLE_DRIVE_FOLDER_ID dan credential di .env.local",
      };
    }

    try {
      // TODO: Implementasi dengan Google Drive API
      // Contoh menggunakan googleapis:
      //
      // const auth = new google.auth.GoogleAuth({
      //   credentials: {
      //     client_email: process.env.GOOGLE_CLIENT_EMAIL,
      //     private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      //   },
      //   scopes: ['https://www.googleapis.com/auth/drive'],
      // });
      //
      // const drive = google.drive({ version: 'v3', auth });
      // const response = await drive.files.create({
      //   requestBody: {
      //     name: fileName,
      //     parents: [folderId],
      //   },
      //   media: {
      //     mimeType,
      //     body: Readable.from(file),
      //   },
      //   fields: 'id, name, size, webViewLink, mimeType',
      // });
      //
      // // Set file permission to shareable
      // await drive.permissions.create({
      //   fileId: response.data.id!,
      //   requestBody: { role: 'reader', type: 'anyone' },
      // });
      //
      // return {
      //   success: true,
      //   data: {
      //     fileId: response.data.id!,
      //     fileName: response.data.name!,
      //     fileUrl: response.data.webViewLink!,
      //     fileSize: `${Math.round(parseInt(response.data.size || '0') / 1024)} KB`,
      //     mimeType: response.data.mimeType!,
      //     folderId,
      //   }
      // };

      console.warn(`[GoogleDriveService] uploadFile(${fileName}) - Belum diimplementasi`);
      return {
        success: true,
        data: {
          fileId: `mock-drive-id-${Date.now()}`,
          fileName,
          fileUrl: `https://drive.google.com/file/d/mock-id/view`,
          fileSize: "0 KB",
          mimeType,
          folderId,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Gagal mengupload file: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  /**
   * Hapus file dari Google Drive.
   */
  async deleteFile(fileId: string): Promise<ServiceResult<void>> {
    if (!this.isConfigured()) {
      return { success: false, error: "Google Drive belum dikonfigurasi." };
    }

    try {
      // TODO: Implementasi dengan Google Drive API
      // await drive.files.delete({ fileId });

      console.warn(`[GoogleDriveService] deleteFile(${fileId}) - Belum diimplementasi`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: `Gagal menghapus file: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  /**
   * Buat sub-folder di dalam folder parent.
   */
  async createFolder(
    folderName: string,
    parentFolderId: string
  ): Promise<ServiceResult<string>> {
    if (!this.isConfigured()) {
      return { success: false, error: "Google Drive belum dikonfigurasi." };
    }

    try {
      // TODO: Implementasi dengan Google Drive API
      // const response = await drive.files.create({
      //   requestBody: {
      //     name: folderName,
      //     mimeType: 'application/vnd.google-apps.folder',
      //     parents: [parentFolderId],
      //   },
      //   fields: 'id',
      // });
      // return { success: true, data: response.data.id! };

      console.warn(`[GoogleDriveService] createFolder(${folderName}) - Belum diimplementasi`);
      return { success: true, data: `mock-folder-id-${Date.now()}` };
    } catch (error) {
      return {
        success: false,
        error: `Gagal membuat folder: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }
}

// Export singleton instance
export const googleDriveService = new GoogleDriveService();
