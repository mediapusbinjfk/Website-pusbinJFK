"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Tag, Plus, Check, Trash2, Layers } from "lucide-react";

export default function PengaturanKategoriPage() {
  const [produkHukumCategories, setProdukHukumCategories] = useState([
    "Peraturan",
    "Keputusan",
    "Surat Edaran",
    "Pedoman",
    "Petunjuk Teknis",
    "Instruksi",
    "Standar",
    "Lainnya",
  ]);

  const [dokumentasiCategories, setDokumentasiCategories] = useState([
    "Pelatihan",
    "Dokumentasi Rapat",
    "Sosialisasi",
    "Bimbingan Teknis",
    "Kunjungan Kerja",
    "Evaluasi",
    "Lainnya",
  ]);

  const [newPH, setNewPH] = useState("");
  const [newDok, setNewDok] = useState("");

  const addPH = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPH.trim()) return;
    if (!produkHukumCategories.includes(newPH.trim())) {
      setProdukHukumCategories([...produkHukumCategories, newPH.trim()]);
    }
    setNewPH("");
  };

  const addDok = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDok.trim()) return;
    if (!dokumentasiCategories.includes(newDok.trim())) {
      setDokumentasiCategories([...dokumentasiCategories, newDok.trim()]);
    }
    setNewDok("");
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Pengaturan Kategori Konten
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola taksonomi dan pengelompokan jenis dokumen serta publikasi kegiatan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Produk Hukum Categories */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <Layers className="w-5 h-5 text-[#005BAA]" />
              <h3 className="text-sm font-bold text-slate-900">Jenis Dokumen Hukum</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {produkHukumCategories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-[#005BAA] border border-blue-200 text-xs font-semibold"
                >
                  <Tag className="w-3 h-3 opacity-60" />
                  {cat}
                </span>
              ))}
            </div>
            <form onSubmit={addPH} className="pt-2 flex gap-2">
              <input
                type="text"
                value={newPH}
                onChange={(e) => setNewPH(e.target.value)}
                placeholder="Tambah jenis dokumen..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#005BAA]/20"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#005BAA] hover:bg-[#003F7D] text-white text-xs font-bold rounded-xl"
              >
                Tambah
              </button>
            </form>
          </div>

          {/* Publikasi Categories */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <Tag className="w-5 h-5 text-[#F7941D]" />
              <h3 className="text-sm font-bold text-slate-900">Kategori Publikasi & Acara</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {dokumentasiCategories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-50 text-[#F7941D] border border-orange-200 text-xs font-semibold"
                >
                  <Tag className="w-3 h-3 opacity-60" />
                  {cat}
                </span>
              ))}
            </div>
            <form onSubmit={addDok} className="pt-2 flex gap-2">
              <input
                type="text"
                value={newDok}
                onChange={(e) => setNewDok(e.target.value)}
                placeholder="Tambah kategori acara..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#F7941D]/20"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#F7941D] hover:bg-[#e08415] text-white text-xs font-bold rounded-xl"
              >
                Tambah
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
