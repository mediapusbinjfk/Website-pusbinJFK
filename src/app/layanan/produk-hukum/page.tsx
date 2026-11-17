"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import {
  Search, Filter, FileText, Download, Eye, Loader2,
  X, RotateCcw,
} from "lucide-react";
import { PageTransition } from "@/components/ui/PageTransition";

interface LegalProduct {
  id: string;
  title: string;
  documentNumber?: string;
  type: string;
  year: number;
  description?: string;
  fileSize?: string;
  fileUrl: string;
  fileName?: string;
  createdAt: string;
}

const TYPE_OPTIONS = [
  "Peraturan",
  "Keputusan",
  "Surat Edaran",
  "Pedoman",
  "Petunjuk Teknis",
  "Instruksi",
  "Standar",
  "Lainnya",
];

const TYPE_COLORS: Record<string, { pill: string; icon: string }> = {
  Peraturan:        { pill: "bg-blue-100 text-blue-700 border-blue-200",       icon: "bg-blue-50 text-blue-500" },
  Keputusan:        { pill: "bg-indigo-100 text-indigo-700 border-indigo-200", icon: "bg-indigo-50 text-indigo-500" },
  "Surat Edaran":   { pill: "bg-purple-100 text-purple-700 border-purple-200", icon: "bg-purple-50 text-purple-500" },
  Pedoman:          { pill: "bg-teal-100 text-teal-700 border-teal-200",         icon: "bg-teal-50 text-teal-500" },
  "Petunjuk Teknis":{ pill: "bg-cyan-100 text-cyan-700 border-cyan-200",         icon: "bg-cyan-50 text-cyan-500" },
  Instruksi:        { pill: "bg-orange-100 text-orange-700 border-orange-200",   icon: "bg-orange-50 text-orange-500" },
  Standar:          { pill: "bg-pink-100 text-pink-700 border-pink-200",         icon: "bg-pink-50 text-pink-500" },
  Lainnya:          { pill: "bg-slate-100 text-slate-600 border-slate-200",      icon: "bg-slate-50 text-slate-400" },
};

// Highlight matching keyword in text
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim() || !text) return <>{text}</>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 text-yellow-900 rounded px-0.5 not-italic">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function ProdukHukumPage() {
  const [products, setProducts] = useState<LegalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedYear, setSelectedYear] = useState("Semua Tahun");
  const searchRef = useRef<HTMLInputElement>(null);

  // Debounce search input 300ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch("/api/produk-hukum");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setProducts(json.data);
        }
      } catch (err) {
        console.error("Gagal memuat produk hukum:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const availableYears = [
    "Semua Tahun",
    ...Array.from(new Set(products.map((p) => String(p.year)))).sort(
      (a, b) => Number(b) - Number(a)
    ),
  ];

  // Client-side filter with all criteria
  const filteredProducts = products.filter((item) => {
    const q = debouncedSearch.toLowerCase().trim();
    const matchSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      (item.documentNumber || "").toLowerCase().includes(q) ||
      (item.description || "").toLowerCase().includes(q);

    const matchCategory =
      selectedCategory === "Semua" || item.type === selectedCategory;

    const matchYear =
      selectedYear === "Semua Tahun" || String(item.year) === selectedYear;

    return matchSearch && matchCategory && matchYear;
  });

  const hasAnyFilter =
    debouncedSearch.trim() !== "" ||
    selectedCategory !== "Semua" ||
    selectedYear !== "Semua Tahun";

  const resetAll = useCallback(() => {
    setSearch("");
    setDebouncedSearch("");
    setSelectedCategory("Semua");
    setSelectedYear("Semua Tahun");
    searchRef.current?.focus();
  }, []);

  return (
    <PageTransition>
      <div className="w-full">
        <PageHeader
          title="Produk Hukum"
          description="Repositori peraturan, perundang-undangan, dan dokumen regulasi resmi terkait Jabatan Fungsional BNPB."
          breadcrumbs={[
            { label: "Beranda", href: "/" },
            { label: "Layanan" },
            { label: "Produk Hukum", href: "/layanan/produk-hukum" },
          ]}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* ─── Search & Filter Bar (Rapi & Terintegrasi) ─────────────── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Kolom Pencarian */}
              <div className={`relative ${hasAnyFilter ? "sm:col-span-6 lg:col-span-6" : "sm:col-span-6 lg:col-span-6"}`}>
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari judul, nomor dokumen, atau kata kunci regulasi..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] transition-all bg-white text-slate-800 text-sm placeholder:text-slate-400"
                />
                {search && (
                  <button
                    onClick={() => { setSearch(""); searchRef.current?.focus(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                    aria-label="Hapus kata kunci pencarian"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Dropdown Kategori Jenis */}
              <div className="sm:col-span-3 lg:col-span-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  aria-label="Pilih Kategori Dokumen"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all bg-white outline-none focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] cursor-pointer ${
                    selectedCategory !== "Semua"
                      ? "border-[#005BAA] text-[#005BAA] font-semibold bg-blue-50/40"
                      : "border-slate-200 text-slate-700 font-medium"
                  }`}
                >
                  <option value="Semua">Semua Kategori</option>
                  {TYPE_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dropdown Tahun */}
              <div className={hasAnyFilter ? "sm:col-span-3 lg:col-span-2" : "sm:col-span-3 lg:col-span-3"}>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  aria-label="Pilih Tahun Regulasi"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all bg-white outline-none focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] cursor-pointer ${
                    selectedYear !== "Semua Tahun"
                      ? "border-[#005BAA] text-[#005BAA] font-semibold bg-blue-50/40"
                      : "border-slate-200 text-slate-700 font-medium"
                  }`}
                >
                  {availableYears.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tombol Reset Filter */}
              {hasAnyFilter && (
                <div className="sm:col-span-12 lg:col-span-1 flex justify-end">
                  <button
                    onClick={resetAll}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-all shadow-sm"
                    title="Reset semua filter"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              )}
            </div>

            {/* Status Jumlah & Info Filter Aktif */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-4 pt-3.5 border-t border-slate-100 text-xs text-slate-500">
              <p>
                {loading ? (
                  "Memuat dokumen..."
                ) : (
                  <>
                    Menampilkan <span className="font-bold text-slate-800">{filteredProducts.length}</span>
                    {hasAnyFilter && products.length !== filteredProducts.length && (
                      <> dari total <span className="font-semibold text-slate-600">{products.length}</span></>
                    )}{" "}
                    dokumen
                    {hasAnyFilter && (
                      <span className="ml-2 inline-flex items-center gap-1 text-[#005BAA] font-semibold bg-blue-50 px-2 py-0.5 rounded-md">
                        <Filter className="w-3 h-3" /> Filter aktif
                      </span>
                    )}
                  </>
                )}
              </p>

              {debouncedSearch && !loading && (
                <p className="text-slate-400">
                  Kata kunci pencarian: <span className="font-semibold text-slate-700">&ldquo;{debouncedSearch}&rdquo;</span>
                </p>
              )}
            </div>
          </div>

          {/* ─── Daftar Hasil Regulasi (Clean Card Table) ──────────────── */}
          <Card className="border border-slate-200 bg-white overflow-hidden shadow-sm">
            {loading ? (
              <div className="text-center py-24 px-4">
                <Loader2 className="w-10 h-10 mx-auto text-[#005BAA] animate-spin mb-4" />
                <h3 className="text-base font-bold text-slate-700">Memuat Produk Hukum...</h3>
                <p className="text-sm text-slate-500 mt-1">Mengambil data regulasi terbaru dari database.</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 px-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-base font-bold text-slate-700 mb-2">
                  {hasAnyFilter ? "Tidak Ada Dokumen yang Sesuai" : "Belum Ada Produk Hukum"}
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  {hasAnyFilter ? (
                    <>
                      Tidak ada dokumen yang cocok dengan filter pencarian saat ini. Anda dapat{" "}
                      <button
                        onClick={resetAll}
                        className="text-[#005BAA] font-semibold underline-offset-2 hover:underline inline-flex items-center gap-1"
                      >
                        mereset filter
                      </button>{" "}
                      untuk menampilkan seluruh dokumen.
                    </>
                  ) : (
                    "Dokumen regulasi dan peraturan resmi saat ini sedang dalam proses pembaruan data."
                  )}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredProducts.map((item) => {
                  const colors = TYPE_COLORS[item.type] || TYPE_COLORS["Lainnya"];
                  return (
                    <div
                      key={item.id}
                      className="p-5 sm:p-6 hover:bg-slate-50/80 transition-colors duration-150 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                    >
                      <div className="flex items-start gap-4 min-w-0 flex-1">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${colors.icon}`}>
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1 leading-snug group-hover:text-[#005BAA] transition-colors">
                            <HighlightText text={item.title} query={debouncedSearch} />
                          </h3>
                          {item.documentNumber && (
                            <p className="text-xs font-mono font-medium text-slate-500 mb-1.5">
                              Nomor: <HighlightText text={item.documentNumber} query={debouncedSearch} />
                            </p>
                          )}
                          {item.description && (
                            <p className="text-xs sm:text-sm text-slate-600 mb-2 line-clamp-2 leading-relaxed">
                              <HighlightText text={item.description} query={debouncedSearch} />
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                            <span className={`px-2.5 py-0.5 rounded-full border font-semibold ${colors.pill}`}>
                              {item.type}
                            </span>
                            <span className="text-slate-500 font-semibold">Tahun {item.year}</span>
                            {item.fileSize && <span className="text-slate-400">• {item.fileSize}</span>}
                          </div>
                        </div>
                      </div>

                      {item.fileUrl && (
                        <div className="flex items-center gap-2 md:ml-auto shrink-0 pt-2 md:pt-0">
                          <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#005BAA] bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-100"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Lihat</span>
                          </a>
                          <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={item.fileName || true}
                            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#005BAA] hover:bg-[#003F7D] rounded-xl transition-colors shadow-sm"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Unduh</span>
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Footer info dokumen */}
          {!loading && filteredProducts.length > 0 && (
            <p className="text-center text-xs text-slate-400 mt-6">
              Menampilkan {filteredProducts.length} dokumen regulasi resmi BNPB
            </p>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
