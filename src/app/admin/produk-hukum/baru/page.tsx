"use client";

import React, { useState, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  ArrowLeft, Upload, FileText, X, CheckCircle,
  Save, AlertCircle, ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LegalProductType, LegalProductStatus } from "@/types/admin";
import { validatePdfFile } from "@/services/googleDrive";

const LEGAL_TYPES: LegalProductType[] = [
  "Peraturan", "Keputusan", "Surat Edaran",
  "Pedoman", "Petunjuk Teknis", "Instruksi", "Standar", "Lainnya",
];

const YEARS = Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i);

export default function AdminProdukHukumBaruPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fileError, setFileError] = useState("");

  const [form, setForm] = useState({
    title: "",
    documentNumber: "",
    type: "" as LegalProductType | "",
    year: new Date().getFullYear(),
    documentDate: "",
    description: "",
    status: "draft" as LegalProductStatus,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFieldChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFile = (file: File) => {
    setFileError("");
    const validation = validatePdfFile(file, 50);
    if (!validation.valid) {
      setFileError(validation.error ?? "File tidak valid");
      return;
    }
    setSelectedFile(file);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setFileError("File PDF wajib diunggah.");
      return;
    }
    if (!form.title.trim()) {
      alert("Judul dokumen wajib diisi.");
      return;
    }
    if (!form.type) {
      alert("Tipe produk hukum wajib dipilih.");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", form.title);
      formData.append("documentNumber", form.documentNumber || "");
      formData.append("type", form.type);
      formData.append("year", String(form.year));
      formData.append("documentDate", form.documentDate || "");
      formData.append("description", form.description || "");
      formData.append("status", form.status);

      const res = await fetch("/api/admin/produk-hukum", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menyimpan produk hukum.");
      }

      setSaved(true);
      setTimeout(() => router.push("/admin/produk-hukum"), 1500);
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  if (saved) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Produk Hukum Berhasil Disimpan!</h3>
          <p className="text-sm text-slate-500 mt-2">Mengalihkan ke daftar produk hukum...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/admin/produk-hukum" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Tambah Produk Hukum</h2>
            <p className="text-sm text-slate-500">Isi metadata dan unggah file PDF dokumen hukum</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <ExternalLink className="w-4 h-4 text-[#005BAA] mt-0.5 shrink-0" />
          <p className="text-sm text-[#005BAA]">
            File PDF akan disimpan otomatis ke folder <strong>Google Drive / Produk Hukum / {form.type || "[Jenis]"}</strong> dan akan ditampilkan di website publik setelah dipublikasikan.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Metadata */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <h3 className="text-sm font-bold text-slate-700">Metadata Dokumen</h3>

            {/* Judul */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Judul Produk Hukum <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm transition-all"
                placeholder="Contoh: Peraturan Menteri PANRB Nomor 43 Tahun 2018 Tentang..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Jenis */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Jenis Produk Hukum <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={form.type}
                  onChange={(e) => handleFieldChange("type", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm bg-white transition-all"
                >
                  <option value="">Pilih jenis dokumen...</option>
                  {LEGAL_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Nomor Dokumen */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Nomor Dokumen</label>
                <input
                  type="text"
                  value={form.documentNumber}
                  onChange={(e) => handleFieldChange("documentNumber", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm transition-all"
                  placeholder="Contoh: PermenPAN-RB 43/2018"
                />
              </div>

              {/* Tahun */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Tahun <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={form.year}
                  onChange={(e) => handleFieldChange("year", Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm bg-white transition-all"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Tanggal Dokumen */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Tanggal Dokumen</label>
                <input
                  type="date"
                  value={form.documentDate}
                  onChange={(e) => handleFieldChange("documentDate", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm bg-white transition-all"
                />
              </div>
            </div>

            {/* Deskripsi */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Deskripsi Singkat</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm resize-none transition-all"
                placeholder="Ringkasan singkat isi dokumen..."
              />
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Status Publikasi</label>
              <div className="flex gap-3 flex-wrap">
                {(["draft", "published", "archived"] as LegalProductStatus[]).map((s) => {
                  const labels: Record<LegalProductStatus, string> = {
                    draft: "Draft (tidak ditampilkan)",
                    published: "Dipublikasikan",
                    archived: "Diarsipkan",
                  };
                  return (
                    <label key={s} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${form.status === s ? "border-[#005BAA] bg-blue-50 text-[#005BAA]" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>
                      <input
                        type="radio"
                        name="status"
                        value={s}
                        checked={form.status === s}
                        onChange={() => handleFieldChange("status", s)}
                        className="sr-only"
                      />
                      <span className="text-sm font-semibold">{labels[s]}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Upload PDF */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-700">
              Upload Dokumen PDF <span className="text-red-500">*</span>
            </h3>

            {!selectedFile ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${dragOver ? "border-[#005BAA] bg-blue-50" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}
              >
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-500">
                  Seret & lepas file PDF di sini, atau{" "}
                  <span className="text-[#005BAA] font-semibold">klik untuk memilih</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">Hanya file PDF (maks. 50MB)</p>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{selectedFile.name}</p>
                  <p className="text-xs text-slate-400">{formatFileSize(selectedFile.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedFile(null); setFileError(""); }}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {fileError && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {fileError}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pb-6">
            <Link href="/admin/produk-hukum" className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              Batal
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#005BAA] hover:bg-[#003F7D] text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-60"
            >
              {saving ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Menyimpan...</>
              ) : (
                <><Save className="w-4 h-4" />Simpan Produk Hukum</>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
