"use client";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { Activity, LogIn, Plus, Edit2, Trash2, Upload, CalendarCheck, RefreshCw, X, CheckCircle, Send } from "lucide-react";
import type { AuditAction, AuditModule } from "@/types/admin";

const mockLogs = [
  { logId: "LOG-010", admin: "Admin", action: "SEND_NOTIFICATION" as AuditAction, module: "Konsultasi" as AuditModule, recordId: "KNS-000005", timestamp: "2026-09-29 10:30:00", description: "Notifikasi WA penjadwalan dikirim ke 08123456789" },
  { logId: "LOG-009", admin: "Admin", action: "SCHEDULE" as AuditAction, module: "Jadwal" as AuditModule, recordId: "SCH-001", timestamp: "2026-09-29 10:28:00", description: "Jadwal konsultasi dibuat untuk KNS-000003" },
  { logId: "LOG-008", admin: "Admin", action: "PROCESS" as AuditAction, module: "Konsultasi" as AuditModule, recordId: "KNS-000004", timestamp: "2026-09-29 09:15:00", description: "Pengajuan KNS-000004 mulai diproses" },
  { logId: "LOG-007", admin: "Admin", action: "CREATE" as AuditAction, module: "Produk Hukum" as AuditModule, recordId: "PH-005", timestamp: "2026-09-28 14:00:00", description: "Produk hukum baru ditambahkan: Pedoman Teknis UKOM 2026" },
  { logId: "LOG-006", admin: "Admin", action: "UPLOAD" as AuditAction, module: "Dokumentasi" as AuditModule, recordId: "DOK-002", timestamp: "2026-09-28 11:30:00", description: "8 foto diupload untuk dokumentasi UKOM" },
  { logId: "LOG-005", admin: "Admin", action: "RESCHEDULE" as AuditAction, module: "Jadwal" as AuditModule, recordId: "SCH-003", timestamp: "2026-09-27 16:00:00", description: "Jadwal diubah dari 22 Sep menjadi 25 Sep 2026" },
  { logId: "LOG-004", admin: "Admin", action: "COMPLETE" as AuditAction, module: "Konsultasi" as AuditModule, recordId: "KNS-000002", timestamp: "2026-09-25 11:05:00", description: "Konsultasi KNS-000002 ditandai selesai" },
  { logId: "LOG-003", admin: "Admin", action: "DELETE" as AuditAction, module: "Dokumentasi" as AuditModule, recordId: "DOK-OLD", timestamp: "2026-09-24 09:00:00", description: "Dokumentasi lama dihapus" },
  { logId: "LOG-002", admin: "Admin", action: "UPDATE" as AuditAction, module: "Template WA" as AuditModule, recordId: "TPL-jadwal", timestamp: "2026-09-23 13:00:00", description: "Template pesan penjadwalan diperbarui" },
  { logId: "LOG-001", admin: "Admin", action: "LOGIN" as AuditAction, module: "Autentikasi" as AuditModule, timestamp: "2026-09-23 08:30:00", description: "Admin berhasil masuk ke portal" },
];

const ACTION_CONFIG: Record<AuditAction, { icon: React.ReactNode; color: string; label: string }> = {
  LOGIN: { icon: <LogIn className="w-3.5 h-3.5" />, color: "text-blue-500 bg-blue-50", label: "Login" },
  LOGOUT: { icon: <LogIn className="w-3.5 h-3.5" />, color: "text-slate-500 bg-slate-50", label: "Logout" },
  CREATE: { icon: <Plus className="w-3.5 h-3.5" />, color: "text-green-500 bg-green-50", label: "Tambah" },
  UPDATE: { icon: <Edit2 className="w-3.5 h-3.5" />, color: "text-orange-500 bg-orange-50", label: "Edit" },
  DELETE: { icon: <Trash2 className="w-3.5 h-3.5" />, color: "text-red-500 bg-red-50", label: "Hapus" },
  UPLOAD: { icon: <Upload className="w-3.5 h-3.5" />, color: "text-purple-500 bg-purple-50", label: "Upload" },
  PROCESS: { icon: <Activity className="w-3.5 h-3.5" />, color: "text-blue-500 bg-blue-50", label: "Proses" },
  SCHEDULE: { icon: <CalendarCheck className="w-3.5 h-3.5" />, color: "text-green-500 bg-green-50", label: "Jadwal" },
  RESCHEDULE: { icon: <RefreshCw className="w-3.5 h-3.5" />, color: "text-yellow-600 bg-yellow-50", label: "Reschedule" },
  CANCEL: { icon: <X className="w-3.5 h-3.5" />, color: "text-red-500 bg-red-50", label: "Batalkan" },
  COMPLETE: { icon: <CheckCircle className="w-3.5 h-3.5" />, color: "text-teal-500 bg-teal-50", label: "Selesai" },
  SEND_NOTIFICATION: { icon: <Send className="w-3.5 h-3.5" />, color: "text-indigo-500 bg-indigo-50", label: "Kirim WA" },
};

import React from "react";

export default function AdminAktivitasPage() {
  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Log Aktivitas</h2>
          <p className="text-sm text-slate-500 mt-0.5">Rekam jejak seluruh aktivitas yang dilakukan oleh admin</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Waktu</th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Aksi</th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide hidden md:table-cell">Modul</th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide hidden md:table-cell">ID Record</th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockLogs.map((log) => {
                  const cfg = ACTION_CONFIG[log.action];
                  return (
                    <tr key={log.logId} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="text-xs text-slate-500 font-mono whitespace-nowrap">{log.timestamp}</p>
                        <p className="text-[10px] text-slate-400">{log.admin}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
                          {cfg.icon}
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="text-xs text-slate-500 font-medium">{log.module}</span>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="text-xs font-mono text-slate-400">{log.recordId ?? "-"}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-xs text-slate-700">{log.description}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
