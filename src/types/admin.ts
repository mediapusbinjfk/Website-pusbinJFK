// ============================================================
// ADMIN PORTAL - TYPE DEFINITIONS
// ============================================================

// ------------------------------------------------------------
// AUTHENTICATION
// ------------------------------------------------------------
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin" | "viewer";
  avatarUrl?: string;
  createdAt: string;
  lastLogin?: string;
}

// ------------------------------------------------------------
// CONSULTATION (PENGAJUAN KONSULTASI)
// ------------------------------------------------------------
export type ConsultationStatus =
  | "menunggu"
  | "diproses"
  | "terjadwal"
  | "selesai"
  | "dibatalkan"
  | "ditolak";

export type ConsultationMethod = "tatap-muka" | "zoom" | "chat";

export interface Consultation {
  id: string; // Format: KNS-XXXXXX
  createdAt: string;
  // Identitas pemohon
  name: string;
  whatsapp: string;
  email?: string;
  institution: string;
  position: string;
  // Detail konsultasi
  consultationMethod: ConsultationMethod;
  topic: string;
  notes?: string;
  estimatedDate: string;
  estimatedTime?: string;
  // Surat dinas
  documentFileName?: string;
  documentDriveId?: string;
  documentDriveUrl?: string;
  // Status & admin
  status: ConsultationStatus;
  adminId?: string;
  processedAt?: string;
}

// ------------------------------------------------------------
// SCHEDULE (JADWAL KONSULTASI)
// ------------------------------------------------------------
export type ScheduleStatus = "aktif" | "selesai" | "dibatalkan";
export type MeetingMethod = "online" | "offline";

export interface ConsultationSchedule {
  scheduleId: string;
  consultationId: string;
  date: string;
  startTime: string;
  endTime: string;
  method: MeetingMethod;
  // Online
  platform?: string;
  meetingLink?: string;
  // Offline
  location?: string;
  room?: string;
  address?: string;
  notes?: string;
  status: ScheduleStatus;
  createdBy: string;
  createdAt: string;
}

// ------------------------------------------------------------
// SCHEDULE HISTORY (RIWAYAT RESCHEDULE)
// ------------------------------------------------------------
export interface ScheduleHistory {
  historyId: string;
  scheduleId: string;
  consultationId: string;
  oldDate: string;
  oldStartTime: string;
  oldEndTime: string;
  newDate: string;
  newStartTime: string;
  newEndTime: string;
  reason: string;
  changedBy: string;
  changedAt: string;
}

// ------------------------------------------------------------
// DOCUMENTATION (DOKUMENTASI KEGIATAN)
// ------------------------------------------------------------
export type DocumentationStatus = "draft" | "published" | "archived";

export interface AdminDocumentation {
  id: string;
  title: string;
  date: string;
  location?: string;
  category: string;
  description?: string;
  thumbnailUrl?: string;
  thumbnailDriveId?: string;
  photos: DocumentationPhoto[];
  status: DocumentationStatus;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DocumentationPhoto {
  id: string;
  url: string;
  driveId?: string;
  caption?: string;
  isThumb: boolean;
  order: number;
}

// ------------------------------------------------------------
// LEGAL PRODUCTS (PRODUK HUKUM)
// ------------------------------------------------------------
export type LegalProductType =
  | "Peraturan"
  | "Keputusan"
  | "Surat Edaran"
  | "Pedoman"
  | "Petunjuk Teknis"
  | "Instruksi"
  | "Standar"
  | "Lainnya";

export type LegalProductStatus = "draft" | "published" | "archived";

export interface AdminLegalProduct {
  id: string;
  title: string;
  documentNumber?: string;
  type: LegalProductType;
  year: number;
  documentDate?: string;
  description?: string;
  // File
  fileName?: string;
  fileSize?: string;
  fileDriveId?: string;
  fileUrl?: string;
  uploadedAt?: string;
  uploadedBy?: string;
  status: LegalProductStatus;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

// ------------------------------------------------------------
// WHATSAPP TEMPLATE
// ------------------------------------------------------------
export type TemplateType = "jadwal" | "reschedule" | "penolakan" | "selesai";

export interface WhatsAppTemplate {
  id: string;
  type: TemplateType;
  name: string;
  content: string;
  isActive: boolean;
  updatedAt: string;
  updatedBy: string;
}

// ------------------------------------------------------------
// NOTIFICATION LOG
// ------------------------------------------------------------
export type NotificationStatus = "pending" | "sent" | "delivered" | "failed";

export interface NotificationLog {
  notificationId: string;
  consultationId: string;
  recipient: string; // nomor WA
  type: TemplateType | string;
  message: string;
  status: NotificationStatus;
  sentAt?: string;
  providerResponse?: string;
}

// ------------------------------------------------------------
// AUDIT LOG
// ------------------------------------------------------------
export type AuditAction =
  | "LOGIN"
  | "LOGOUT"
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "UPLOAD"
  | "PROCESS"
  | "SCHEDULE"
  | "RESCHEDULE"
  | "CANCEL"
  | "COMPLETE"
  | "SEND_NOTIFICATION";

export type AuditModule =
  | "Dokumentasi"
  | "Produk Hukum"
  | "Konsultasi"
  | "Jadwal"
  | "Template WA"
  | "Pengaturan"
  | "Autentikasi";

export interface AuditLog {
  logId: string;
  admin: string;
  action: AuditAction;
  module: AuditModule;
  recordId?: string;
  timestamp: string;
  description: string;
}

// ------------------------------------------------------------
// DASHBOARD SUMMARY
// ------------------------------------------------------------
export interface DashboardStats {
  totalDocumentation: number;
  totalLegalProducts: number;
  consultationNew: number;
  consultationProcessed: number;
  consultationScheduled: number;
  consultationDone: number;
}

// ------------------------------------------------------------
// GOOGLE SHEETS SERVICE TYPES
// ------------------------------------------------------------
export interface SheetConfig {
  sheetId: string;
  range: string;
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ------------------------------------------------------------
// CATEGORY
// ------------------------------------------------------------
export interface Category {
  id: string;
  name: string;
  module: "dokumentasi" | "produk-hukum";
  createdAt: string;
}
