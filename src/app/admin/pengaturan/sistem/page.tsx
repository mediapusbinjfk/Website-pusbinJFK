"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Cog,
  ShieldCheck,
  Database,
  Mail,
  Calendar,
  Key,
  Server,
  Save,
  CheckCircle2,
} from "lucide-react";

export default function PengaturanSistemPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Pengaturan Sistem & Integrasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Status konfigurasi server, integrasi database Supabase, dan parameter keamanan
          </p>
        </div>

        {saved && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Konfigurasi sistem berhasil diperbarui.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Integrasi Database */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Database PostgreSQL Supabase</h3>
                <p className="text-xs text-slate-500">Koneksi data cloud utama</p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Status Koneksi:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Terhubung (Active)
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Host Pooler:</span>
                <span className="font-mono text-slate-700">aws-0-ap-southeast-2.pooler.supabase.com</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Prisma ORM:</span>
                <span className="font-mono text-slate-700">v6.x Client Synced</span>
              </div>
            </div>
          </div>

          {/* Card 2: Server SMTP & Email */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#005BAA] flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Layanan Email Kedinasan</h3>
                <p className="text-xs text-slate-500">SMTP Server Resmi BNPB</p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">SMTP Host:</span>
                <span className="font-mono text-slate-700">mail.bnpb.go.id (Port 25)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Akun Pengirim:</span>
                <span className="font-mono text-slate-700">PusbinJFKebencanaan@bnpb.go.id</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Tujuan Naskah Dinas:</span>
                <span className="font-mono text-slate-700">SetPusbinJFK@bnpb.go.id</span>
              </div>
            </div>
          </div>

          {/* Card 3: Google Service Account */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F7941D] flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Google Calendar API</h3>
                <p className="text-xs text-slate-500">Sinkronisasi jadwal konsultasi</p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Service Account:</span>
                <span className="font-mono text-slate-700 truncate max-w-[220px]">testing@platinum-hour-510306-q2.iam.gserviceaccount.com</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Target Calendar ID:</span>
                <span className="font-mono text-slate-700">cielo.16ltd@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Card 4: Keamanan Sesi & Proxy */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Keamanan Sesi & Proxy</h3>
                <p className="text-xs text-slate-500">Proteksi rute dan otorisasi</p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Algoritma Enkripsi:</span>
                <span className="font-mono text-slate-700">HMAC-SHA256 Token</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Proteksi Cookie:</span>
                <span className="font-mono text-slate-700">HttpOnly, SameSite=Lax</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Next.js Interceptor:</span>
                <span className="font-mono text-slate-700">src/proxy.ts Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
