"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ArrowLeft, Save, Loader2, CheckCircle, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LegalProductType, LegalProductStatus } from "@/types/admin";

const LEGAL_TYPES: LegalProductType[] = [
  "Peraturan",
  "Keputusan",
  "Surat Edaran",
  "Pedoman",
  "Petunjuk Teknis",
  "Instruksi",
  "Standar",
  "Lainnya",
];

const YEARS = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i);

export default function EditProdukHukumPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    title: "",
    documentNumber: "",
    type: "Peraturan" as LegalProductType,
    year: new Date().getFullYear(),
    documentDate: "",
    description: "",
    status: "published" as LegalProductStatus,
    fileUrl: "",
    fileName: "",
    fileSize: "",
  });

  useEffect(() => {
    async function fetchDetail() {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/produk-hukum/${params.id}`);
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          setForm({
            title: d.title || "",
            documentNumber: d.documentNumber || "",
            type: d.type || "Peraturan",
            year: d.year || new Date().getFullYear(),
            documentDate: d.documentDate || "",
            description: d.description || "",
            status: d.status || "published",
            fileUrl: d.fileUrl || "",
            fileName: d.fileName || "",
            fileSize: d.fileSize || "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Judul dokumen wajib diisi.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/produk-hukum/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          documentNumber: form.documentNumber.trim(),
          type: form.type,
          year: form.year,
          description: form.description.trim(),
          status: form.status,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal memperbarui produk hukum.");
      }

      setSaved(true);
      setTimeout(() => router.push("/admin/produk-hukum"), 1000);
    } catch (err: any) {
      alert(err?.message || "Terjadi kesalahan saat menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto py-20 text-center space-y-3">
          <Loader2 className="w-10 h-10 mx-auto text-[#005BAA] animate-spin" />
          <p className="text-sm text-slate-500">Memuat data produk hukum...</p>
        </div>
      </AdminLayout>
    );
  }

  if (saved) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Perubahan Berhasil Disimpan!</h3>
          <p className="text-sm text-slate-500 mt-2">Mengalihkan ke daftar produk hukum...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/produk-hukum"
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Edit Produk Hukum</h1>
            <p className="text-xs text-slate-500 mt-0.5">Perbarui informasi dan metadata regulasi di Supabase</p>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Judul Dokumen / Regulasi <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA]"
                placeholder="Contoh: Peraturan BNPB Nomor 4 Tahun 2019..."
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Nomor Dokumen
                </label>
                <input
                  type="text"
                  value={form.documentNumber}
                  onChange={(e) => setForm({ ...form, documentNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA]"
                  placeholder="Contoh: PERBAN-04/2019"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Jenis Produk Hukum <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as LegalProductType })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA]"
                  required
                >
                  {LEGAL_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Tahun Terbit <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: parseInt(e.target.value, 10) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA]"
                  required
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Status Dokumen
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as LegalProductStatus })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA]"
                >
                  <option value="published">Dipublikasikan (Aktif)</option>
                  <option value="draft">Draft (Disembunyikan)</option>
                  <option value="archived">Diarsipkan</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Deskripsi / Ringkasan Dokumen
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA]"
                placeholder="Ringkasan poin penting regulasi..."
              />
            </div>

            {form.fileUrl && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-[#005BAA]" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">{form.fileName || "File Terlampir"}</p>
                    <p className="text-[11px] text-slate-500">{form.fileSize || "Ukuran file tersimpan"}</p>
                  </div>
                </div>
                <a
                  href={form.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#005BAA] hover:underline"
                >
                  Lihat Berkas
                </a>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link
              href="/admin/produk-hukum"
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#005BAA] hover:bg-[#003F7D] text-white text-sm font-semibold rounded-xl transition-all shadow-sm disabled:opacity-60"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan ke Supabase...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

