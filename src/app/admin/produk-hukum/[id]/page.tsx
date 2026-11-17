"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ArrowLeft, FileText, Download, Edit2, Calendar, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LegalProductType, LegalProductStatus } from "@/types/admin";

export interface LegalProductItem {
  id: string;
  title: string;
  documentNumber?: string | null;
  type: LegalProductType;
  year: number;
  documentDate?: string | null;
  description?: string | null;
  fileSize?: string | null;
  fileName?: string | null;
  fileUrl?: string | null;
  status: LegalProductStatus;
  createdAt: string;
}

const STATUS_CONFIG: Record<LegalProductStatus, { label: string; className: string }> = {
  published: { label: "Dipublikasikan", className: "bg-green-100 text-green-700" },
  draft: { label: "Draft", className: "bg-yellow-100 text-yellow-700" },
  archived: { label: "Diarsipkan", className: "bg-slate-100 text-slate-500" },
};

const TYPE_COLORS: Record<LegalProductType, string> = {
  Peraturan: "bg-blue-100 text-blue-700",
  Keputusan: "bg-indigo-100 text-indigo-700",
  "Surat Edaran": "bg-purple-100 text-purple-700",
  Pedoman: "bg-teal-100 text-teal-700",
  "Petunjuk Teknis": "bg-cyan-100 text-cyan-700",
  Instruksi: "bg-orange-100 text-orange-700",
  Standar: "bg-pink-100 text-pink-700",
  Lainnya: "bg-slate-100 text-slate-600",
};

export default function DetailProdukHukumPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const router = useRouter();
  const [doc, setDoc] = useState<LegalProductItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/produk-hukum/${params.id}`);
        const json = await res.json();
        if (json.success && json.data) {
          setDoc({
            ...json.data,
            createdAt: new Date(json.data.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
          });
        }
      } catch (err) {
        console.error("Gagal memuat detail produk hukum:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [params.id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto py-20 text-center space-y-3">
          <Loader2 className="w-10 h-10 mx-auto text-[#005BAA] animate-spin" />
          <p className="text-sm text-slate-500">Memuat detail produk hukum dari Supabase...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!doc) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
          <FileText className="w-12 h-12 mx-auto text-slate-300" />
          <h2 className="text-lg font-bold text-slate-700">Produk Hukum Tidak Ditemukan</h2>
          <p className="text-sm text-slate-500">Data produk hukum dengan ID tersebut belum tersedia atau telah dihapus di Supabase.</p>
          <Link
            href="/admin/produk-hukum"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#005BAA] text-white text-sm font-semibold rounded-xl hover:bg-[#004B8C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Produk Hukum
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const statusCfg = STATUS_CONFIG[doc.status] || STATUS_CONFIG.published;
  const typeCfg = TYPE_COLORS[doc.type] ?? "bg-slate-100 text-slate-600";

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back & Top Bar */}
        <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/produk-hukum"
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900">Detail Produk Hukum</h1>
                <span className="font-mono text-xs font-bold text-[#005BAA] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                  {doc.id}
                </span>
              </div>
              <p className="text-xs text-slate-400">Ditambahkan pada: {doc.createdAt}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusCfg.className}`}>
              {statusCfg.label}
            </span>
            <div className="h-6 w-px bg-slate-200"></div>
            <Link
              href={`/admin/produk-hukum/${doc.id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div>
            <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold mb-3 ${typeCfg}`}>
              {doc.type}
            </span>
            <h2 className="text-xl font-bold text-slate-900">{doc.title}</h2>
            {doc.documentNumber && (
              <p className="text-sm font-mono text-slate-500 mt-2">Nomor: {doc.documentNumber}</p>
            )}
            {doc.description && (
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">{doc.description}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-[#005BAA]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Tahun Terbit</p>
                <p className="text-sm font-semibold text-slate-800">{doc.year}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Ukuran File</p>
                <p className="text-sm font-semibold text-slate-800">{doc.fileSize || "-"}</p>
              </div>
            </div>
          </div>

          {doc.fileUrl && (
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{doc.fileName || `${doc.title}.pdf`}</p>
                  <p className="text-xs text-slate-400">Dokumen PDF • {doc.fileSize || "-"}</p>
                </div>
              </div>
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#005BAA] hover:bg-[#003F7D] text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                Buka / Unduh File
              </a>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
