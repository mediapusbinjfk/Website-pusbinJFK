"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ArrowLeft, FileText, Download, Edit2, Calendar } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LegalProductType, LegalProductStatus } from "@/types/admin";

// MOCK DATA
const mockProducts = [
  {
    id: "PH-001",
    title: "Peraturan Menteri PANRB Nomor 43 Tahun 2018 Tentang Jabatan Fungsional Penata Penanggulangan Bencana",
    documentNumber: "PermenPAN-RB 43/2018",
    type: "Peraturan" as LegalProductType,
    year: 2018,
    fileSize: "2.4 MB",
    status: "published" as LegalProductStatus,
    createdAt: "2026-01-10",
  },
  {
    id: "PH-002",
    title: "Peraturan BNPB Nomor 4 Tahun 2019 Tentang Petunjuk Pelaksanaan Jabatan Fungsional",
    documentNumber: "Perkepala BNPB 4/2019",
    type: "Peraturan" as LegalProductType,
    year: 2019,
    fileSize: "1.8 MB",
    status: "published" as LegalProductStatus,
    createdAt: "2026-01-10",
  },
  {
    id: "PH-003",
    title: "Keputusan Kepala BNPB Nomor 12A Tahun 2023 Tentang Penilaian Angka Kredit",
    documentNumber: "Kepka BNPB 12A/2023",
    type: "Keputusan" as LegalProductType,
    year: 2023,
    fileSize: "980 KB",
    status: "published" as LegalProductStatus,
    createdAt: "2026-01-15",
  },
  {
    id: "PH-004",
    title: "Surat Edaran Nomor: SE/01/BNPB/2024 Perihal Pembinaan dan Pengembangan Karier JF",
    documentNumber: "SE/01/BNPB/2024",
    type: "Surat Edaran" as LegalProductType,
    year: 2024,
    fileSize: "450 KB",
    status: "published" as LegalProductStatus,
    createdAt: "2026-02-20",
  },
  {
    id: "PH-005",
    title: "Pedoman Teknis Pelaksanaan Uji Kompetensi Kenaikan Jenjang 2026",
    documentNumber: "PED-JF-01/2026",
    type: "Pedoman" as LegalProductType,
    year: 2026,
    fileSize: "3.2 MB",
    status: "draft" as LegalProductStatus,
    createdAt: "2026-08-01",
  },
];

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
  const [doc, setDoc] = useState<typeof mockProducts[0] | null>(null);
  
  useEffect(() => {
    const found = mockProducts.find((d) => d.id === params.id) || mockProducts[0];
    if (found) setDoc(found);
  }, [params.id]);

  if (!doc) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-slate-500">Memuat data produk hukum...</div>
      </AdminLayout>
    );
  }

  const statusCfg = STATUS_CONFIG[doc.status];
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
            <p className="text-sm font-mono text-slate-500 mt-2">{doc.documentNumber}</p>
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
                <p className="text-sm font-semibold text-slate-800">{doc.fileSize}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{doc.documentNumber}.pdf</p>
                <p className="text-xs text-slate-400">Dokumen PDF • {doc.fileSize}</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#005BAA] hover:bg-[#003F7D] text-white text-sm font-semibold rounded-xl transition-all shadow-sm">
              <Download className="w-4 h-4" />
              Unduh File
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
