"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Activity, Plus, FileText, ImageIcon, Users, Mail, Loader2, Calendar } from "lucide-react";

interface ActivityItem {
  id: string;
  module: string;
  action: string;
  title: string;
  timestamp: string;
  icon: any;
  color: string;
}

export default function AdminAktivitasPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadActivities() {
      try {
        setLoading(true);
        const [phRes, dokRes, knsRes, srtRes] = await Promise.all([
          fetch("/api/admin/produk-hukum").then((r) => r.json()).catch(() => ({ data: [] })),
          fetch("/api/admin/dokumentasi").then((r) => r.json()).catch(() => ({ data: [] })),
          fetch("/api/consultations").then((r) => r.json()).catch(() => ({ data: [] })),
          fetch("/api/admin/surat-dinas").then((r) => r.json()).catch(() => ({ data: [] })),
        ]);

        const combined: ActivityItem[] = [];

        if (Array.isArray(phRes.data)) {
          phRes.data.forEach((item: any) => {
            combined.push({
              id: item.id,
              module: "Produk Hukum",
              action: "Upload Regulasi",
              title: item.title,
              timestamp: item.createdAt,
              icon: FileText,
              color: "text-blue-600 bg-blue-50 border-blue-200",
            });
          });
        }

        if (Array.isArray(dokRes.data)) {
          dokRes.data.forEach((item: any) => {
            combined.push({
              id: item.id,
              module: "Publikasi",
              action: "Upload Dokumentasi",
              title: item.title,
              timestamp: item.createdAt,
              icon: ImageIcon,
              color: "text-orange-600 bg-orange-50 border-orange-200",
            });
          });
        }

        if (Array.isArray(knsRes.data)) {
          knsRes.data.forEach((item: any) => {
            combined.push({
              id: item.id,
              module: "Konsultasi",
              action: "Pengajuan Masuk",
              title: `${item.name} (${item.institution})`,
              timestamp: item.createdAt,
              icon: Users,
              color: "text-emerald-600 bg-emerald-50 border-emerald-200",
            });
          });
        }

        if (Array.isArray(srtRes.data)) {
          srtRes.data.forEach((item: any) => {
            combined.push({
              id: item.id,
              module: "Naskah Dinas",
              action: "Surat Masuk",
              title: item.perihal,
              timestamp: item.createdAt,
              icon: Mail,
              color: "text-purple-600 bg-purple-50 border-purple-200",
            });
          });
        }

        combined.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setActivities(combined);
      } catch (err) {
        console.error("Gagal memuat log aktivitas:", err);
      } finally {
        setLoading(false);
      }
    }
    loadActivities();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Log Aktivitas & Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Rekam jejak seluruh operasi data, unggahan dokumen, dan pengajuan konsultasi
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 text-[#005BAA] animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500">Menghimpun log aktivitas riil...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <Activity className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">Belum Ada Aktivitas</p>
              <p className="text-xs text-slate-400">
                Aktivitas akan tercatat otomatis saat dokumen diunggah atau konsultasi diajukan.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {activities.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={`${item.module}-${item.id}`} className="p-4 hover:bg-slate-50 flex items-center justify-between gap-4 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${item.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            {item.module}
                          </span>
                          <span className="text-xs font-semibold text-slate-500">{item.action}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-900 mt-0.5 max-w-md truncate">{item.title}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 whitespace-nowrap">
                      {new Date(item.timestamp).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
