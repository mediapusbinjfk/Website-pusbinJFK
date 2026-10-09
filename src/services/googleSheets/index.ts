/**
 * GoogleSheetsService
 * 
 * Abstraksi untuk komunikasi dengan Google Sheets sebagai database.
 * Seluruh operasi data dilakukan melalui service ini.
 * 
 * Untuk menggantinya dengan database lain di masa depan (PostgreSQL, MySQL, dll.),
 * cukup ganti implementasi di file ini tanpa mengubah Repository layer.
 * 
 * PENTING: Service ini hanya boleh digunakan di server-side (API Routes / Server Actions).
 * Jangan import langsung ke komponen React client-side.
 */

import { ServiceResult } from "@/types/admin";

// ============================================================
// KONFIGURASI SHEET
// ============================================================
// Nama sheet di dalam Spreadsheet. Sesuaikan dengan nama tab yang dibuat.
export const SHEET_NAMES = {
  CONSULTATIONS: "consultations",
  SCHEDULES: "schedules",
  SCHEDULE_HISTORY: "schedule_history",
  NOTIFICATION_LOGS: "notification_logs",
  AUDIT_LOGS: "audit_logs",
  DOCUMENTATION: "documentation",
  LEGAL_PRODUCTS: "legal_products",
  CATEGORIES: "categories",
  WA_TEMPLATES: "wa_templates",
  ADMIN_USERS: "admin_users",
} as const;

// Header kolom untuk setiap sheet (urutan harus sama dengan data)
export const SHEET_HEADERS = {
  [SHEET_NAMES.CONSULTATIONS]: [
    "id",
    "created_at",
    "name",
    "whatsapp",
    "email",
    "institution",
    "position",
    "consultation_method",
    "topic",
    "notes",
    "estimated_date",
    "document_file_name",
    "document_drive_id",
    "document_drive_url",
    "status",
    "admin_id",
    "processed_at",
  ],
  [SHEET_NAMES.SCHEDULES]: [
    "schedule_id",
    "consultation_id",
    "date",
    "start_time",
    "end_time",
    "method",
    "platform",
    "meeting_link",
    "location",
    "room",
    "address",
    "notes",
    "status",
    "created_by",
    "created_at",
  ],
  [SHEET_NAMES.SCHEDULE_HISTORY]: [
    "history_id",
    "schedule_id",
    "consultation_id",
    "old_date",
    "old_start_time",
    "old_end_time",
    "new_date",
    "new_start_time",
    "new_end_time",
    "reason",
    "changed_by",
    "changed_at",
  ],
  [SHEET_NAMES.NOTIFICATION_LOGS]: [
    "notification_id",
    "consultation_id",
    "recipient",
    "type",
    "message",
    "status",
    "sent_at",
    "provider_response",
  ],
  [SHEET_NAMES.AUDIT_LOGS]: [
    "log_id",
    "admin",
    "action",
    "module",
    "record_id",
    "timestamp",
    "description",
  ],
  [SHEET_NAMES.DOCUMENTATION]: [
    "id",
    "title",
    "date",
    "location",
    "category",
    "description",
    "thumbnail_url",
    "thumbnail_drive_id",
    "status",
    "created_by",
    "created_at",
    "updated_at",
  ],
  [SHEET_NAMES.LEGAL_PRODUCTS]: [
    "id",
    "title",
    "document_number",
    "type",
    "year",
    "document_date",
    "description",
    "file_name",
    "file_size",
    "file_drive_id",
    "file_url",
    "uploaded_at",
    "uploaded_by",
    "status",
    "created_by",
    "created_at",
    "updated_at",
  ],
};

// ============================================================
// TIPE DATA INTERNAL
// ============================================================
type SheetRow = string[];
type SheetData = SheetRow[];

// ============================================================
// GOOGLE SHEETS SERVICE CLASS
// ============================================================
class GoogleSheetsService {
  private spreadsheetId: string;

  constructor() {
    this.spreadsheetId = process.env.GOOGLE_SHEETS_ID || "";
  }

  private isConfigured(): boolean {
    return (
      !!this.spreadsheetId &&
      !!process.env.GOOGLE_CLIENT_EMAIL &&
      !!process.env.GOOGLE_PRIVATE_KEY
    );
  }

  /**
   * Baca semua baris dari sebuah sheet.
   */
  async readSheet(sheetName: string): Promise<ServiceResult<SheetData>> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: "Google Sheets belum dikonfigurasi. Isi GOOGLE_SHEETS_ID dan credential di .env.local",
      };
    }

    try {
      // TODO: Implementasi dengan Google Sheets API
      // Contoh menggunakan googleapis:
      //
      // const auth = new google.auth.GoogleAuth({
      //   credentials: {
      //     client_email: process.env.GOOGLE_CLIENT_EMAIL,
      //     private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      //   },
      //   scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      // });
      //
      // const sheets = google.sheets({ version: 'v4', auth });
      // const response = await sheets.spreadsheets.values.get({
      //   spreadsheetId: this.spreadsheetId,
      //   range: sheetName,
      // });
      //
      // return { success: true, data: response.data.values || [] };

      console.warn(`[GoogleSheetsService] readSheet(${sheetName}) - Belum diimplementasi`);
      return { success: true, data: [] };
    } catch (error) {
      return {
        success: false,
        error: `Gagal membaca sheet: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  /**
   * Tambah satu baris baru ke sheet.
   */
  async appendRow(sheetName: string, row: SheetRow): Promise<ServiceResult<void>> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: "Google Sheets belum dikonfigurasi.",
      };
    }

    try {
      // TODO: Implementasi dengan Google Sheets API
      // const sheets = google.sheets({ version: 'v4', auth });
      // await sheets.spreadsheets.values.append({
      //   spreadsheetId: this.spreadsheetId,
      //   range: sheetName,
      //   valueInputOption: 'USER_ENTERED',
      //   requestBody: { values: [row] },
      // });

      console.warn(`[GoogleSheetsService] appendRow(${sheetName}) - Belum diimplementasi`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: `Gagal menambah baris: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  /**
   * Update baris berdasarkan nomor baris (1-indexed, row 1 = header).
   */
  async updateRow(
    sheetName: string,
    rowNumber: number,
    row: SheetRow
  ): Promise<ServiceResult<void>> {
    if (!this.isConfigured()) {
      return { success: false, error: "Google Sheets belum dikonfigurasi." };
    }

    try {
      // TODO: Implementasi dengan Google Sheets API
      // await sheets.spreadsheets.values.update({
      //   spreadsheetId: this.spreadsheetId,
      //   range: `${sheetName}!A${rowNumber}`,
      //   valueInputOption: 'USER_ENTERED',
      //   requestBody: { values: [row] },
      // });

      console.warn(`[GoogleSheetsService] updateRow(${sheetName}, ${rowNumber}) - Belum diimplementasi`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: `Gagal mengupdate baris: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  /**
   * Hapus baris berdasarkan nomor baris (Google Sheets tidak mendukung delete baris secara langsung,
   * baris akan dikosongkan atau digeser tergantung implementasi).
   */
  async deleteRow(sheetName: string, rowNumber: number): Promise<ServiceResult<void>> {
    if (!this.isConfigured()) {
      return { success: false, error: "Google Sheets belum dikonfigurasi." };
    }

    try {
      // TODO: Implementasi menggunakan batchUpdate untuk delete baris
      console.warn(`[GoogleSheetsService] deleteRow(${sheetName}, ${rowNumber}) - Belum diimplementasi`);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: `Gagal menghapus baris: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  /**
   * Konversi array baris (dari readSheet) menjadi array objek menggunakan header.
   */
  rowsToObjects<T extends Record<string, string>>(
    headers: string[],
    rows: SheetData
  ): T[] {
    return rows.slice(1).map((row) => {
      const obj: Record<string, string> = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || "";
      });
      return obj as T;
    });
  }

  /**
   * Konversi objek menjadi array nilai sesuai urutan header.
   */
  objectToRow(headers: string[], obj: Record<string, string | number | boolean | undefined | null>): SheetRow {
    return headers.map((header) => {
      const val = obj[header];
      if (val === undefined || val === null) return "";
      return String(val);
    });
  }
}

// Export singleton instance
export const googleSheetsService = new GoogleSheetsService();
