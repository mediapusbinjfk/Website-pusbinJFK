
"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Plus, Search, Edit2, Trash2, Eye, Calendar, MapPin,
  ImageIcon, ChevronUp, ChevronDown, Filter,
  LayoutList, LayoutGrid, Grid2X2,
} from "lucide-react";
import Link from "next/link";
import { useAktivitasStore } from "@/lib/aktivitasStore";
import { useDokumentasiStore } from "@/lib/dokumentasiStore";

// ============================================================
// MOCK DATA (akan diganti dari Google Sheets)
// ============================================================
// MOCK DATA dipindahkan ke dokumentasiStore.ts

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  published: { label: "Dipublikasikan", className: "bg-green-100 text-green-700" },
  "Selesai": { label: "Selesai", className: "bg-green-100 text-green-700" },
  draft: { label: "Draft", className: "bg-yellow-100 text-yellow-700" },
  "Akan Datang": { label: "Akan Datang", className: "bg-blue-100 text-blue-700" },
  "Sedang Berlangsung": { label: "Sedang Berlangsung", className: "bg-purple-100 text-purple-700" },
  archived: { label: "Diarsipkan", className: "bg-slate-100 text-slate-500" },
};

type SortField = "title" | "date";
type SortDir = "asc" | "desc";
type ViewMode = "list" | "grid-md" | "grid-lg";

// ============================================================
// VIEW MODE TOGGLE CONFIG
// ============================================================
const VIEW_MODES: { key: ViewMode; icon: React.ReactNode; label: string }[] = [
  { key: "list",    icon: <LayoutList className="w-4 h-4" />,   label: "Daftar" },
  { key: "grid-md", icon: <LayoutGrid className="w-4 h-4" />,   label: "Grid Sedang" },
  { key: "grid-lg", icon: <Grid2X2 className="w-4 h-4" />,      label: "Grid Besar" },
];

export default function AdminDokumentasiPage() {
  // useAktivitasStore = shared store → perubahan di sini langsung tampil di halaman publik
  const { aktivitas: docs, deleteAktivitas } = useAktivitasStore();
  const { deleteDoc } = useDokumentasiStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("semua");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const handleDelete = () => {
    if (deleteId) {
      deleteAktivitas(deleteId); // ← hapus dari shared store, otomatis sinkron ke halaman publik
      deleteDoc(deleteId);
      setDeleteId(null);
    }
  };

  // Filter + sort
  const filtered = docs
    .filter((d) => {
      const matchSearch =
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.location.toLowerCase().includes(search.toLowerCase()) ||
        d.category.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "semua" || d.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      const va = a[sortField] ?? "";
      const vb = b[sortField] ?? "";
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp className="w-3 h-3 text-slate-300" />;
    return sortDir === "asc"
      ? <ChevronUp className="w-3 h-3 text-[#005BAA]" />
      : <ChevronDown className="w-3 h-3 text-[#005BAA]" />;
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Dokumentasi Kegiatan</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Kelola galeri foto dan rekaman kegiatan resmi JF BNPB
            </p>
          </div>
          <Link
            href="/admin/dokumentasi/baru"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#005BAA] hover:bg-[#003F7D] text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Dokumentasi
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari judul, lokasi, kategori..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm bg-white text-slate-700"
              >
                <option value="semua">Semua Status</option>
                <option value="Selesai">Selesai</option>
                <option value="Akan Datang">Akan Datang</option>
                <option value="Sedang Berlangsung">Sedang Berlangsung</option>
              </select>
            </div>

            {/* VIEW MODE TOGGLE */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              {VIEW_MODES.map((vm) => (
                <button
                  key={vm.key}
                  onClick={() => setViewMode(vm.key)}
                  title={vm.label}
                  className={`p-2 rounded-lg transition-all duration-150 ${
                    viewMode === vm.key
                      ? "bg-white shadow-sm text-[#005BAA]"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {vm.icon}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Menampilkan <span className="font-semibold text-slate-600">{filtered.length}</span> dari {docs.length} dokumentasi
          </p>
        </div>

        {/* ============ LIST VIEW ============ */}
        {viewMode === "list" && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide w-8">No</th>
                    <th className="text-left px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide w-20">Thumbnail</th>
                    <th
                      className="text-left px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide cursor-pointer hover:text-slate-700 select-none"
                      onClick={() => handleSort("title")}
                    >
                      <div className="flex items-center gap-1">Judul <SortIcon field="title" /></div>
                    </th>
                    <th
                      className="text-left px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide cursor-pointer hover:text-slate-700 select-none hidden md:table-cell"
                      onClick={() => handleSort("date")}
                    >
                      <div className="flex items-center gap-1">Tanggal <SortIcon field="date" /></div>
                    </th>
                    <th className="text-left px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Lokasi</th>
                    <th className="text-left px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Status</th>
                    <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-16 text-slate-400 text-sm">
                        <ImageIcon className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                        Tidak ada dokumentasi ditemukan
                      </td>
                    </tr>
                  ) : (
                    filtered.map((doc, i) => {
                      const statusCfg = STATUS_CONFIG[doc.status] ?? { label: doc.status, className: "bg-slate-100 text-slate-500" };
                      return (
                        <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-4 text-slate-400 text-xs font-mono">{i + 1}</td>
                          <td className="px-4 py-4">
                            <div className="w-16 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 text-slate-300" />
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-semibold text-slate-800 line-clamp-2 max-w-xs">{doc.title}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{doc.category} · {doc.photoCount ?? 1} foto</p>
                          </td>
                          <td className="px-4 py-4 hidden md:table-cell">
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Calendar className="w-3.5 h-3.5 text-slate-300" />
                              <span className="text-xs">{doc.date}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 hidden lg:table-cell">
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <MapPin className="w-3.5 h-3.5 text-slate-300" />
                              <span className="text-xs line-clamp-1">{doc.location}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.className}`}>
                              {statusCfg.label}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <Link href={`/admin/dokumentasi/${doc.id}`} className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-[#005BAA] transition-colors" title="Lihat">
                                <Eye className="w-4 h-4" />
                              </Link>
                              <Link href={`/admin/dokumentasi/${doc.id}/edit`} className="p-2 rounded-lg hover:bg-orange-50 text-slate-400 hover:text-[#F7941D] transition-colors" title="Edit">
                                <Edit2 className="w-4 h-4" />
                              </Link>
                              <button onClick={() => setDeleteId(doc.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Hapus">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============ GRID MEDIUM VIEW ============ */}
        {viewMode === "grid-md" && (
          <div>
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-sm bg-white rounded-2xl border border-slate-200">
                <ImageIcon className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                Tidak ada dokumentasi ditemukan
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((doc) => {
                  const statusCfg = STATUS_CONFIG[doc.status] ?? { label: doc.status, className: "bg-slate-100 text-slate-500" };
                  return (
                    <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md hover:border-slate-300 transition-all group">
                      {/* Thumbnail */}
                      <div className="w-full h-28 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-slate-200 group-hover:text-slate-300 transition-colors" />
                      </div>
                      {/* Content */}
                      <div className="p-3 space-y-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusCfg.className}`}>
                          {statusCfg.label}
                        </span>
                        <p className="text-sm font-semibold text-slate-800 line-clamp-2 leading-tight">{doc.title}</p>
                        <p className="text-[11px] text-slate-400">{doc.category} · {doc.photoCount ?? 1} foto</p>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Calendar className="w-3 h-3 text-slate-300" />
                          {doc.date}
                        </div>
                        {/* Actions */}
                        <div className="flex items-center gap-1 pt-1 border-t border-slate-100">
                          <Link href={`/admin/dokumentasi/${doc.id}`} className="flex-1 flex items-center justify-center p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-[#005BAA] transition-colors" title="Lihat">
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <Link href={`/admin/dokumentasi/${doc.id}/edit`} className="flex-1 flex items-center justify-center p-1.5 rounded-lg hover:bg-orange-50 text-slate-400 hover:text-[#F7941D] transition-colors" title="Edit">
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>
                          <button onClick={() => setDeleteId(doc.id)} className="flex-1 flex items-center justify-center p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Hapus">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============ GRID LARGE VIEW ============ */}
        {viewMode === "grid-lg" && (
          <div>
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-sm bg-white rounded-2xl border border-slate-200">
                <ImageIcon className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                Tidak ada dokumentasi ditemukan
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((doc) => {
                  const statusCfg = STATUS_CONFIG[doc.status] ?? { label: doc.status, className: "bg-slate-100 text-slate-500" };
                  return (
                    <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all group">
                      {/* Large Thumbnail */}
                      <div className="w-full h-44 bg-gradient-to-br from-blue-50 via-slate-50 to-slate-100 flex flex-col items-center justify-center gap-2 relative">
                        <ImageIcon className="w-12 h-12 text-slate-200 group-hover:text-slate-300 transition-colors" />
                        <span className="text-xs text-slate-300">{doc.photoCount ?? 1} foto</span>
                        {/* Status badge overlay */}
                        <div className="absolute top-3 right-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold shadow-sm ${statusCfg.className}`}>
                            {statusCfg.label}
                          </span>
                        </div>
                      </div>
                      {/* Content */}
                      <div className="p-4 space-y-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wide text-[#005BAA] bg-blue-50 px-2 py-0.5 rounded-full">
                            {doc.category}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug">{doc.title}</p>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Calendar className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                            {doc.date}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                            <span className="line-clamp-1">{doc.location}</span>
                          </div>
                        </div>
                        {/* Action bar */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          <Link
                            href={`/admin/dokumentasi/${doc.id}`}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#005BAA]/5 hover:bg-[#005BAA]/10 text-[#005BAA] text-xs font-semibold transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" /> Lihat
                          </Link>
                          <Link
                            href={`/admin/dokumentasi/${doc.id}/edit`}
                            className="flex items-center justify-center p-2 rounded-xl hover:bg-orange-50 text-slate-400 hover:text-[#F7941D] transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteId(doc.id)}
                            className="flex items-center justify-center p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-base font-bold text-slate-800 text-center mb-2">Hapus Dokumentasi?</h3>
            <p className="text-sm text-slate-500 text-center mb-6">
              Tindakan ini tidak dapat dibatalkan. Data dan foto terkait akan dihapus permanen.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
