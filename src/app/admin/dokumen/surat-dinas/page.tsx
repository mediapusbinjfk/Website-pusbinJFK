"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { FileText, Search, Download, Eye, Calendar, User, Building2, Clock, Filter } from "lucide-react";
import { ConsultationStore } from "@/lib/consultationStore";
import type { Consultation } from "@/types/admin";

export default function SuratDinasPage() {
  const [documents, setDocuments] = useState<Consultation[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "menunggu" | "terjadwal" | "selesai">("all");

  useEffect(() => {
    // Ambil semua konsultasi yang memiliki dokumen (surat dinas)
    const all = ConsultationStore.getConsultations();
    const withDoc = all.filter((c) => !!c.documentFileName);
    setDocuments(withDoc);
  }, []);

  const filtered = documents
    .filter((c) => {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.institution.toLowerCase().includes(q) ||
        c.documentFileName!.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      );
    })
    .filter((c) => filterStatus === "all" ? true : c.status === filterStatus);

  // Format nama file rapi: [NamaDepan]_[Instansi]_[ID].pdf
  const formatDocName = (c: Consultation): string => {
    const namePart = c.name.split(" ")[0].replace(/[^a-zA-Z0-9]/g, "");
    const instPart = c.institution
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .trim()
      .split(" ")
      .slice(0, 3)
      .join("_");
    return `SuratDinas_${namePart}_${instPart}_${c.id}.pdf`;
  };

  const STATUS_LABEL: Record<string, { label: string; className: string }> = {
    menunggu: { label: "Menunggu", className: "bg-amber-50 text-amber-700 border border-amber-200" },
    diproses: { label: "Diproses", className: "bg-blue-50 text-blue-700 border border-blue-200" },
    terjadwal: { label: "Terjadwal", className: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
    selesai: { label: "Selesai", className: "bg-slate-100 text-slate-600 border border-slate-200" },
    dibatalkan: { label: "Dibatalkan", className: "bg-red-50 text-red-600 border border-red-200" },
    ditolak: { label: "Ditolak", className: "bg-red-50 text-red-700 border border-red-200" },
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Surat Dinas Pemohon</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Dokumen surat pengantar yang diunggah oleh pemohon konsultasi
            </p>
          </div>
          <span className="bg-[#005BAA]/10 text-[#005BAA] font-bold text-xs px-3 py-1.5 rounded-full">
            {filtered.length} Dokumen
          </span>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama, instansi, atau nomor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA]"
            >
              <option value="all">Semua Status</option>
              <option value="menunggu">Menunggu</option>
              <option value="terjadwal">Terjadwal</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
        </div>

        {/* Document List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <FileText className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm font-medium">Belum ada surat dinas yang diunggah</p>
            <p className="text-xs mt-1 text-slate-400">
              Surat dinas akan muncul di sini saat pemohon mengunggah file saat pengajuan konsultasi
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((c, idx) => {
              const statusCfg = STATUS_LABEL[c.status] || STATUS_LABEL.menunggu;
              const cleanName = formatDocName(c);

              return (
                <div
                  key={`${c.id}-${idx}`}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-slate-300 transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* File Icon */}
                    <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-red-500" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <div>
                          <p className="font-mono text-xs font-bold text-[#005BAA] mb-0.5">{cleanName}</p>
                          <p className="text-[11px] text-slate-400 italic">
                            Nama asli: {c.documentFileName}
                          </p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${statusCfg.className}`}>
                          {statusCfg.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-medium text-slate-700 truncate">{c.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{c.institution}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{c.createdAt.split("T")[0]}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-[11px] text-slate-400">No. Pengajuan:</span>
                        <span className="font-mono text-xs font-bold text-slate-700">{c.id}</span>
                        <span className="text-[11px] text-slate-400 ml-3">Topik:</span>
                        <span className="text-xs text-slate-600">{c.topic}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Diunggah: {new Date(c.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric", month: "long", year: "numeric"
                      })}
                    </p>
                    <div className="flex items-center gap-2">
                      <a
                        href={`/admin/konsultasi/pengajuan/${c.id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#005BAA] bg-blue-50 hover:bg-blue-100 rounded-lg transition-all border border-blue-100"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Lihat Pengajuan
                      </a>
                      <button
                        onClick={() => {
                          // Simulasi download — ganti dengan URL file asli saat integrasi storage
                          const link = document.createElement("a");
                          link.href = "#";
                          link.download = cleanName;
                          link.click();
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#005BAA] hover:bg-[#003F7D] rounded-lg transition-all shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Unduh
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
