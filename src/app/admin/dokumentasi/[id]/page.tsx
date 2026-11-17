"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ArrowLeft, Calendar, MapPin, ImageIcon, Edit2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { DocumentationStatus } from "@/types/admin";
import { useDokumentasiStore, type Documentation } from "@/lib/dokumentasiStore";
import { useAktivitasStore } from "@/lib/aktivitasStore";

// MOCK DATA dipindahkan ke dokumentasiStore.ts

const STATUS_CONFIG: Record<DocumentationStatus, { label: string; className: string }> = {
  published: { label: "Dipublikasikan", className: "bg-green-100 text-green-700" },
  draft: { label: "Draft", className: "bg-yellow-100 text-yellow-700" },
  archived: { label: "Diarsipkan", className: "bg-slate-100 text-slate-500" },
};

export default function DetailDokumentasiPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const router = useRouter();
  const { docs } = useDokumentasiStore();
  const { aktivitas } = useAktivitasStore();
  const [doc, setDoc] = useState<Documentation | null>(null);
  
  useEffect(() => {
    const foundDoc = docs.find((d) => d.id === params.id);
    if (foundDoc) {
      setDoc(foundDoc);
      return;
    }
    const foundAct = aktivitas.find((a) => a.id === params.id);
    if (foundAct) {
      setDoc({
        id: foundAct.id,
        title: foundAct.title,
        date: foundAct.date,
        location: foundAct.location,
        category: foundAct.category,
        photoCount: foundAct.photoCount ?? 1,
        status: (foundAct.status === "Selesai" ? "published" : foundAct.status === "Akan Datang" ? "draft" : "published") as DocumentationStatus,
        createdBy: foundAct.organizer || "Admin",
        createdAt: foundAct.createdAt || foundAct.date,
        content: foundAct.description,
      });
      return;
    }
    setDoc(null);
  }, [params.id, docs, aktivitas]);

  if (!doc) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
          <ImageIcon className="w-12 h-12 mx-auto text-slate-300" />
          <h2 className="text-lg font-bold text-slate-700">Publikasi Tidak Ditemukan</h2>
          <p className="text-sm text-slate-500">Data publikasi dengan ID tersebut belum tersedia atau telah dihapus.</p>
          <Link
            href="/admin/dokumentasi"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#005BAA] text-white text-sm font-semibold rounded-xl hover:bg-[#004B8C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Publikasi
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const statusCfg = STATUS_CONFIG[doc.status];

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back & Top Bar */}
        <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dokumentasi"
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900">Detail Publikasi</h1>
                <span className="font-mono text-xs font-bold text-[#005BAA] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                  {doc.id}
                </span>
              </div>
              <p className="text-xs text-slate-400">Dibuat pada: {doc.createdAt}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusCfg.className}`}>
              {statusCfg.label}
            </span>
            <div className="h-6 w-px bg-slate-200"></div>
            <Link
              href={`/admin/dokumentasi/${doc.id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wide text-[#005BAA] bg-blue-50 px-2.5 py-1 rounded-full">
                  {doc.category}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-3">{doc.title}</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-[#005BAA]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Tanggal Kegiatan</p>
                    <p className="text-sm font-semibold text-slate-800">{doc.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-0.5">Lokasi</p>
                    <p className="text-sm font-semibold text-slate-800 line-clamp-1" title={doc.location}>{doc.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#005BAA]" />
                  Galeri Foto ({doc.photoCount})
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Array.from({ length: Math.min(doc.photoCount, 6) }).map((_, i) => (
                  <div key={i} className="aspect-square bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden relative group cursor-pointer">
                    <ImageIcon className="w-8 h-8 text-slate-300" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-medium">Lihat</span>
                    </div>
                  </div>
                ))}
                {doc.photoCount > 6 && (
                  <div className="aspect-square bg-slate-50 rounded-xl border border-slate-200 border-dashed flex flex-col items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer">
                    <span className="text-lg font-bold">+{doc.photoCount - 6}</span>
                    <span className="text-xs">Foto Lainnya</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                Informasi Sistem
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-[11px] text-slate-400 mb-0.5">ID Publikasi</p>
                  <p className="text-sm font-semibold text-slate-800">{doc.id}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 mb-0.5">Dibuat Oleh</p>
                  <p className="text-sm font-semibold text-slate-800">{doc.createdBy}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 mb-0.5">Tanggal Dibuat</p>
                  <p className="text-sm font-semibold text-slate-800">{doc.createdAt}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
