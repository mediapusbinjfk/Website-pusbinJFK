"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  FileText,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Loader2,
  Mail,
  Building2,
  Calendar,
} from "lucide-react";
import Link from "next/link";

interface SuratDinasItem {
  id: string;
  nomorSurat: string | null;
  perihal: string;
  pengajuNama: string;
  pengajuEmail: string | null;
  unitKerja: string | null;
  status: string;
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pending: { label: "Menunggu Verifikasi", className: "bg-amber-50 text-amber-700 border-amber-200" },
  diverifikasi: { label: "Diverifikasi", className: "bg-blue-50 text-blue-700 border-blue-200" },
  disposisi: { label: "Didisposisikan", className: "bg-purple-50 text-purple-700 border-purple-200" },
  selesai: { label: "Selesai", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  ditolak: { label: "Ditolak", className: "bg-red-50 text-red-700 border-red-200" },
};

export default function SuratDinasPage() {
  const [letters, setLetters] = useState<SuratDinasItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form input
  const [form, setForm] = useState({
    nomorSurat: "",
    perihal: "",
    pengajuNama: "",
    pengajuEmail: "",
    unitKerja: "",
    status: "pending",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/surat-dinas");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setLetters(json.data);
      }
    } catch (err) {
      console.error("Gagal memuat surat dinas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.perihal || !form.pengajuNama) {
      alert("Harap isi perihal dan nama pengirim.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/surat-dinas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal mencatat naskah dinas.");
      }
      setIsModalOpen(false);
      setForm({
        nomorSurat: "",
        perihal: "",
        pengajuNama: "",
        pengajuEmail: "",
        unitKerja: "",
        status: "pending",
      });
      loadData();
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredLetters = letters.filter((item) => {
    const matchStatus = statusFilter === "semua" || item.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      item.perihal.toLowerCase().includes(q) ||
      item.pengajuNama.toLowerCase().includes(q) ||
      (item.nomorSurat || "").toLowerCase().includes(q) ||
      (item.unitKerja || "").toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Manajemen Naskah Dinas & Surat Masuk
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Pencatatan, verifikasi, dan disposisi naskah dinas resmi Pusbin JF Kebencanaan BNPB
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://srikandi.arsip.go.id/auth/login"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#005BAA]" />
              <span>Portal SRIKANDI</span>
            </a>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#005BAA] hover:bg-[#004787] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-900/15"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Surat Baru</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari perihal, nomor, atau pengirim..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA]"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#005BAA]/20"
            >
              <option value="semua">Semua Status</option>
              <option value="pending">Menunggu Verifikasi</option>
              <option value="diverifikasi">Diverifikasi</option>
              <option value="disposisi">Didisposisikan</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
        </div>

        {/* Table List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 text-[#005BAA] animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500">Memuat data naskah dinas...</p>
            </div>
          ) : filteredLetters.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">Belum Ada Naskah Dinas</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Surat dinas kedinasan yang masuk via Srikandi maupun email resmi SetPusbinJFK@bnpb.go.id dapat dicatat di sini.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Nomor & Perihal</th>
                    <th className="py-3 px-4">Pengirim & Instansi</th>
                    <th className="py-3 px-4">Tanggal Masuk</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLetters.map((item) => {
                    const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="font-bold text-slate-900 leading-snug">{item.perihal}</p>
                          <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                            {item.nomorSurat || "Tanpa Nomor Surat"}
                          </p>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-800">{item.pengajuNama}</p>
                          <p className="text-[11px] text-slate-500">{item.unitKerja || "-"}</p>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {new Date(item.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border ${cfg.className}`}>
                            {cfg.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Catat Surat */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-bold text-slate-900">Catat Naskah Dinas Baru</h3>
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor Surat Dinas</label>
                  <input
                    type="text"
                    value={form.nomorSurat}
                    onChange={(e) => setForm({ ...form, nomorSurat: e.target.value })}
                    placeholder="Contoh: ND.124/BPBD/IX/2026"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Perihal <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.perihal}
                    onChange={(e) => setForm({ ...form, perihal: e.target.value })}
                    placeholder="Contoh: Usulan Uji Kompetensi Kenaikan Jenjang"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Pengirim <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.pengajuNama}
                    onChange={(e) => setForm({ ...form, pengajuNama: e.target.value })}
                    placeholder="Nama lengkap & gelar"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Instansi / Unit Kerja</label>
                  <input
                    type="text"
                    value={form.unitKerja}
                    onChange={(e) => setForm({ ...form, unitKerja: e.target.value })}
                    placeholder="Contoh: BPBD Provinsi Jawa Barat"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-[#005BAA] hover:bg-[#003F7D] text-white font-bold rounded-xl"
                  >
                    {submitting ? "Menyimpan..." : "Simpan Surat"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
