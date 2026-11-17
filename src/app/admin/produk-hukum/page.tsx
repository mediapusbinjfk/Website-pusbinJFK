"use client";

import React, { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Plus, Search, Edit2, Trash2, Eye, FileText,
  Download, ChevronUp, ChevronDown, Filter,
  LayoutList, LayoutGrid, Grid2X2, Loader2,
  X, RotateCcw,
} from "lucide-react";
import Link from "next/link";
import type { LegalProductType, LegalProductStatus } from "@/types/admin";

export interface LegalProductItem {
  id: string;
  title: string;
  documentNumber: string;
  type: LegalProductType;
  year: number;
  fileSize: string;
  fileUrl?: string;
  fileName?: string;
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

// Icon color per type for the document card icon
const TYPE_ICON_BG: Record<LegalProductType, string> = {
  Peraturan: "bg-blue-50 text-blue-400",
  Keputusan: "bg-indigo-50 text-indigo-400",
  "Surat Edaran": "bg-purple-50 text-purple-400",
  Pedoman: "bg-teal-50 text-teal-400",
  "Petunjuk Teknis": "bg-cyan-50 text-cyan-400",
  Instruksi: "bg-orange-50 text-orange-400",
  Standar: "bg-pink-50 text-pink-400",
  Lainnya: "bg-slate-50 text-slate-400",
};

type SortField = "title" | "year" | "type" | "createdAt";
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

function PHSortIcon({ field, currentField, sortDir }: { field: SortField; currentField: SortField; sortDir: SortDir }) {
  if (currentField !== field) return <ChevronUp className="w-3 h-3 text-slate-300" />;
  return sortDir === "asc"
    ? <ChevronUp className="w-3 h-3 text-[#005BAA]" />
    : <ChevronDown className="w-3 h-3 text-[#005BAA]" />;
}

export default function AdminProdukHukumPage() {
  const [products, setProducts] = useState<LegalProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<LegalProductType | "semua">("semua");
  const [statusFilter, setStatusFilter] = useState<LegalProductStatus | "semua">("semua");
  const [yearFilter, setYearFilter] = useState<string>("semua");
  const [sortField, setSortField] = useState<SortField>("year");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const searchRef = useRef<HTMLInputElement>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/produk-hukum");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setProducts(
          json.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            documentNumber: item.documentNumber || "-",
            type: item.type as LegalProductType,
            year: item.year,
            fileSize: item.fileSize || "-",
            fileUrl: item.fileUrl,
            fileName: item.fileName,
            status: item.status as LegalProductStatus,
            createdAt: new Date(item.createdAt).toLocaleDateString("id-ID"),
          }))
        );
      }
    } catch (err) {
      console.error("Gagal mengambil data produk hukum:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/produk-hukum/${deleteId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        alert(json.error || "Gagal menghapus produk hukum.");
      } else {
        setProducts((prev) => prev.filter((p) => p.id !== deleteId));
      }
    } catch {
      alert("Terjadi kesalahan saat menghapus.");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const years = ["semua", ...Array.from(new Set(products.map((p) => String(p.year)))).sort((a, b) => Number(b) - Number(a))];

  const activeFilterCount =
    (typeFilter !== "semua" ? 1 : 0) +
    (statusFilter !== "semua" ? 1 : 0) +
    (yearFilter !== "semua" ? 1 : 0);

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("semua");
    setStatusFilter("semua");
    setYearFilter("semua");
    searchRef.current?.focus();
  };

  const filtered = products
    .filter((p) => {
      const q = (debouncedSearch || search).toLowerCase();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.documentNumber.toLowerCase().includes(q);
      const matchType = typeFilter === "semua" || p.type === typeFilter;
      const matchStatus = statusFilter === "semua" || p.status === statusFilter;
      const matchYear = yearFilter === "semua" || String(p.year) === yearFilter;
      return matchSearch && matchType && matchStatus && matchYear;
    })
    .sort((a, b) => {
      const va = String(a[sortField] ?? "");
      const vb = String(b[sortField] ?? "");
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Produk Hukum</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Kelola peraturan, keputusan, dan dokumen hukum JF BNPB
            </p>
          </div>
          <Link
            href="/admin/produk-hukum/baru"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#005BAA] hover:bg-[#003F7D] text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Produk Hukum
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Cari judul atau nomor dokumen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm transition-all"
              />
              {search && (
                <button
                  onClick={() => { setSearch(""); searchRef.current?.focus(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Hapus pencarian"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 text-slate-400">
                <Filter className="w-4 h-4 shrink-0" />
                {activeFilterCount > 0 && (
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#005BAA] text-white text-[10px] font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as LegalProductType | "semua")}
                className={`px-3 py-2.5 rounded-xl border focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm bg-white transition-colors ${typeFilter !== "semua" ? "border-[#005BAA] text-[#005BAA] font-semibold" : "border-slate-200 text-slate-700"}`}
              >
                <option value="semua">Semua Jenis</option>
                {["Peraturan", "Keputusan", "Surat Edaran", "Pedoman", "Petunjuk Teknis", "Instruksi", "Standar", "Lainnya"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as LegalProductStatus | "semua")}
                className={`px-3 py-2.5 rounded-xl border focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm bg-white transition-colors ${statusFilter !== "semua" ? "border-[#005BAA] text-[#005BAA] font-semibold" : "border-slate-200 text-slate-700"}`}
              >
                <option value="semua">Semua Status</option>
                <option value="published">Dipublikasikan</option>
                <option value="draft">Draft</option>
                <option value="archived">Diarsipkan</option>
              </select>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className={`px-3 py-2.5 rounded-xl border focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm bg-white transition-colors ${yearFilter !== "semua" ? "border-[#005BAA] text-[#005BAA] font-semibold" : "border-slate-200 text-slate-700"}`}
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y === "semua" ? "Semua Tahun" : y}</option>
                ))}
              </select>
              {(search || activeFilterCount > 0) && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                  title="Reset semua filter"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
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
          <p className="text-xs text-slate-400">
            Menampilkan <span className="font-semibold text-slate-600">{filtered.length}</span> dari {products.length} dokumen
            {(search || activeFilterCount > 0) && filtered.length !== products.length && (
              <span className="text-[#005BAA] font-semibold"> (filter aktif)</span>
            )}
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
                    <th
                      className="text-left px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide cursor-pointer hover:text-slate-700"
                      onClick={() => handleSort("title")}
                    >
                      <div className="flex items-center gap-1">Judul Dokumen <PHSortIcon field="title" currentField={sortField} sortDir={sortDir} /></div>
                    </th>
                    <th
                      className="text-left px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide cursor-pointer hover:text-slate-700"
                      onClick={() => handleSort("type")}
                    >
                      <div className="flex items-center gap-1">Jenis <PHSortIcon field="type" currentField={sortField} sortDir={sortDir} /></div>
                    </th>
                    <th
                      className="text-left px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide cursor-pointer hover:text-slate-700 hidden md:table-cell"
                      onClick={() => handleSort("year")}
                    >
                      <div className="flex items-center gap-1">Tahun <PHSortIcon field="year" currentField={sortField} sortDir={sortDir} /></div>
                    </th>
                    <th className="text-left px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Ukuran</th>
                    <th className="text-left px-4 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Status</th>
                    <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wide">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-16 text-slate-400 text-sm">
                        <Loader2 className="w-8 h-8 mx-auto mb-3 text-[#005BAA] animate-spin" />
                        Memuat data dari database Supabase...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-16 text-slate-400 text-sm">
                        <FileText className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                        Tidak ada produk hukum ditemukan
                      </td>
                    </tr>
                  ) : (
                    filtered.map((doc, i) => {
                      const statusCfg = STATUS_CONFIG[doc.status];
                      const typeCfg = TYPE_COLORS[doc.type] ?? "bg-slate-100 text-slate-600";
                      return (
                        <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-4 text-slate-400 text-xs font-mono">{i + 1}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-start gap-3">
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${TYPE_ICON_BG[doc.type] ?? "bg-red-50 text-red-400"}`}>
                                <FileText className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800 line-clamp-2 max-w-xs leading-tight">{doc.title}</p>
                                <p className="text-xs text-slate-400 mt-0.5 font-mono">{doc.documentNumber}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${typeCfg}`}>
                              {doc.type}
                            </span>
                          </td>
                          <td className="px-4 py-4 hidden md:table-cell">
                            <span className="text-sm font-bold text-slate-600">{doc.year}</span>
                          </td>
                          <td className="px-4 py-4 hidden lg:table-cell">
                            <span className="text-xs text-slate-400">{doc.fileSize}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.className}`}>
                              {statusCfg.label}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-1">
                              {doc.fileUrl && (
                                <a
                                  href={doc.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-[#005BAA] transition-colors"
                                  title="Unduh / Buka Dokumen"
                                >
                                  <Download className="w-4 h-4" />
                                </a>
                              )}
                              <Link href={`/admin/produk-hukum/${doc.id}`} className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-[#005BAA] transition-colors" title="Lihat detail">
                                <Eye className="w-4 h-4" />
                              </Link>
                              <Link href={`/admin/produk-hukum/${doc.id}/edit`} className="p-2 rounded-lg hover:bg-orange-50 text-slate-400 hover:text-[#F7941D] transition-colors" title="Edit">
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
                <FileText className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                Tidak ada produk hukum ditemukan
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((doc) => {
                  const statusCfg = STATUS_CONFIG[doc.status];
                  const typeCfg = TYPE_COLORS[doc.type] ?? "bg-slate-100 text-slate-600";
                  const iconBg = TYPE_ICON_BG[doc.type] ?? "bg-red-50 text-red-400";
                  return (
                    <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md hover:border-slate-300 transition-all group space-y-3">
                      {/* Icon + badges */}
                      <div className="flex items-start justify-between">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
                          <FileText className="w-5 h-5" />
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusCfg.className}`}>
                          {statusCfg.label}
                        </span>
                      </div>
                      {/* Info */}
                      <div>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold mb-1.5 ${typeCfg}`}>{doc.type}</span>
                        <p className="text-sm font-semibold text-slate-800 line-clamp-3 leading-tight">{doc.title}</p>
                        <p className="text-[11px] text-slate-400 mt-1 font-mono">{doc.documentNumber}</p>
                      </div>
                      {/* Year + Size */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-bold text-slate-600">{doc.year}</span>
                        <span>{doc.fileSize}</span>
                      </div>
                      {/* Actions */}
                      <div className="flex items-center gap-1 pt-2 border-t border-slate-100">
                        <button className="flex-1 flex items-center justify-center p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-[#005BAA] transition-colors" title="Unduh">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <Link href={`/admin/produk-hukum/${doc.id}`} className="flex-1 flex items-center justify-center p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-[#005BAA] transition-colors" title="Lihat">
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link href={`/admin/produk-hukum/${doc.id}/edit`} className="flex-1 flex items-center justify-center p-1.5 rounded-lg hover:bg-orange-50 text-slate-400 hover:text-[#F7941D] transition-colors" title="Edit">
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button onClick={() => setDeleteId(doc.id)} className="flex-1 flex items-center justify-center p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Hapus">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
                <FileText className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                Tidak ada produk hukum ditemukan
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((doc) => {
                  const statusCfg = STATUS_CONFIG[doc.status];
                  const typeCfg = TYPE_COLORS[doc.type] ?? "bg-slate-100 text-slate-600";
                  const iconBg = TYPE_ICON_BG[doc.type] ?? "bg-red-50 text-red-400";
                  return (
                    <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all group">
                      {/* Document preview header */}
                      <div className={`w-full h-32 flex flex-col items-center justify-center gap-2 relative ${iconBg.replace("text-", "from-").split(" ")[0]} bg-gradient-to-br from-slate-50 to-slate-100`}>
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${iconBg}`}>
                          <FileText className="w-7 h-7" />
                        </div>
                        <span className="text-[11px] text-slate-400">{doc.fileSize}</span>
                        {/* Status badge overlay */}
                        <div className="absolute top-3 right-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold shadow-sm ${statusCfg.className}`}>
                            {statusCfg.label}
                          </span>
                        </div>
                        {/* Year badge */}
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/80 backdrop-blur-sm text-slate-600 shadow-sm">
                            {doc.year}
                          </span>
                        </div>
                      </div>
                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <div>
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold mb-2 ${typeCfg}`}>{doc.type}</span>
                          <p className="text-sm font-bold text-slate-800 line-clamp-3 leading-snug">{doc.title}</p>
                          <p className="text-xs text-slate-400 mt-1.5 font-mono">{doc.documentNumber}</p>
                        </div>
                        {/* Action bar */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#005BAA]/5 hover:bg-[#005BAA]/10 text-[#005BAA] text-xs font-semibold transition-colors">
                            <Download className="w-3.5 h-3.5" /> Unduh
                          </button>
                          <Link
                            href={`/admin/produk-hukum/${doc.id}`}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" /> Lihat
                          </Link>
                          <Link href={`/admin/produk-hukum/${doc.id}/edit`} className="flex items-center justify-center p-2 rounded-xl hover:bg-orange-50 text-slate-400 hover:text-[#F7941D] transition-colors" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button onClick={() => setDeleteId(doc.id)} className="flex items-center justify-center p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Hapus">
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

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !isDeleting && setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-base font-bold text-slate-800 text-center mb-2">Hapus Produk Hukum?</h3>
            <p className="text-sm text-slate-500 text-center mb-6">
              File dokumen dan data produk hukum ini akan dihapus secara permanen dari database.
            </p>
            <div className="flex gap-3">
              <button
                disabled={isDeleting}
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
