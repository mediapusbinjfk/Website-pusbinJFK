"use client";

import React, { useState, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  ArrowLeft, Upload, X, Star, Image as ImageIcon,
  Calendar, MapPin, Tag, AlignLeft, CheckCircle, Save,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { DocumentationStatus } from "@/types/admin";
import { useDokumentasiStore } from "@/lib/dokumentasiStore";
import { useAktivitasStore } from "@/lib/aktivitasStore";

const CATEGORIES = [
  "Dokumentasi Rapat",
  "Pelatihan",
  "Kunjungan Kerja",
  "Sosialisasi",
  "Bimbingan Teknis",
  "Evaluasi",
  "Lainnya",
];

interface PhotoPreview {
  id: string;
  file: File;
  previewUrl: string;
  caption: string;
  isThumb: boolean;
}

export default function AdminDokumentasiEditPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const router = useRouter();
  const { docs, updateDoc } = useDokumentasiStore();
  const { aktivitas, updateAktivitas } = useAktivitasStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Cari data doc atau aktivitas berdasarkan params.id
  const docToEdit = docs.find((d) => d.id === params.id);
  const actToEdit = aktivitas.find((a) => a.id === params.id);

  // Form state, inisialisasi dari docToEdit atau actToEdit jika ada
  const [form, setForm] = useState({
    title: docToEdit?.title || actToEdit?.title || "",
    date: docToEdit?.date || actToEdit?.date || "",
    location: docToEdit?.location || actToEdit?.location || "",
    category: docToEdit?.category || actToEdit?.category || "",
    description: docToEdit?.content || actToEdit?.description || "",
    status: (docToEdit?.status || (actToEdit?.status === "Selesai" ? "published" : actToEdit?.status === "Akan Datang" ? "draft" : "published")) as DocumentationStatus,
  });
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const handleFieldChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Handle file drop / select
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newPhotos: PhotoPreview[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
        caption: "",
        isThumb: false,
      }));

    setPhotos((prev) => {
      const combined = [...prev, ...newPhotos];
      // Jika belum ada thumbnail, set foto pertama sebagai thumbnail
      if (!combined.some((p) => p.isThumb) && combined.length > 0) {
        combined[0].isThumb = true;
      }
      return combined;
    });
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      // Jika yang dihapus adalah thumbnail, set yang pertama sebagai thumbnail baru
      if (prev.find((p) => p.id === id)?.isThumb && filtered.length > 0) {
        filtered[0].isThumb = true;
      }
      return filtered;
    });
  };

  const setThumbnail = (id: string) => {
    setPhotos((prev) =>
      prev.map((p) => ({ ...p, isThumb: p.id === id }))
    );
  };

  const updateCaption = (id: string, caption: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, caption } : p))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Simpan pembaruan ke store Zustand
      const updatedDoc = {
        title: form.title || "Tanpa Judul",
        date: form.date,
        location: form.location,
        category: form.category,
        status: form.status,
        content: form.description,
        // Jika ada penambahan foto, asumsi photoCount bertambah.
        photoCount: ((docToEdit?.photoCount || actToEdit?.photoCount || 1)) + photos.length,
      };

      updateDoc(params.id, updatedDoc);
      updateAktivitas(params.id, {
        title: form.title || "Tanpa Judul",
        date: form.date,
        location: form.location,
        category: form.category,
        description: form.description,
        status: form.status === "draft" ? "Akan Datang" : "Selesai",
        photoCount: updatedDoc.photoCount,
      });

      await new Promise((r) => setTimeout(r, 1000)); // simulasi loading
      setSaved(true);
      setTimeout(() => router.push(`/admin/dokumentasi/${params.id}`), 1000);
    } catch {
      alert("Terjadi kesalahan saat menyimpan.");
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
          <h3 className="text-lg font-bold text-slate-800">Dokumentasi Berhasil Disimpan!</h3>
          <p className="text-sm text-slate-500 mt-2">Mengalihkan ke daftar dokumentasi...</p>
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
            href="/admin/dokumentasi"
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Edit Dokumentasi Kegiatan</h2>
            <p className="text-sm text-slate-500">Perbarui informasi kegiatan {docToEdit?.id}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Info Kegiatan */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-[#005BAA]" />
              Informasi Kegiatan
            </h3>

            {/* Judul */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">
                Judul Kegiatan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm transition-all"
                placeholder="Contoh: Rapat Koordinasi Nasional Pembinaan JF..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Tanggal */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Tanggal Kegiatan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => handleFieldChange("date", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm bg-white transition-all"
                  />
                </div>
              </div>

              {/* Lokasi */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Lokasi</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => handleFieldChange("location", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm transition-all"
                    placeholder="Contoh: Graha BNPB, Jakarta"
                  />
                </div>
              </div>

              {/* Kategori */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    required
                    value={form.category}
                    onChange={(e) => handleFieldChange("category", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm bg-white transition-all"
                  >
                    <option value="">Pilih kategori...</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Status Publikasi</label>
                <select
                  value={form.status}
                  onChange={(e) => handleFieldChange("status", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm bg-white transition-all"
                >
                  <option value="draft">Draft (tidak ditampilkan)</option>
                  <option value="published">Dipublikasikan</option>
                  <option value="archived">Diarsipkan</option>
                </select>
              </div>
            </div>

            {/* Deskripsi */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Deskripsi</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm resize-none transition-all"
                placeholder="Deskripsi singkat kegiatan..."
              />
            </div>
          </div>

          {/* Upload Foto */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#005BAA]" />
                Foto Kegiatan
                {photos.length > 0 && (
                  <span className="text-xs font-semibold text-[#005BAA] bg-blue-50 px-2 py-0.5 rounded-full">
                    {photos.length} foto
                  </span>
                )}
              </h3>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                Pilih Foto
              </button>
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFiles(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                dragOver
                  ? "border-[#005BAA] bg-blue-50"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <Upload className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-500">
                Seret & lepas foto di sini, atau{" "}
                <span className="text-[#005BAA] font-semibold">klik untuk memilih</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">JPG, PNG, WebP (maks. 10MB per foto)</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />

            {/* Photo Grid */}
            {photos.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-500">
                  Klik bintang ⭐ untuk menetapkan thumbnail utama
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {photos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.previewUrl}
                        alt=""
                        className="w-full h-28 object-cover rounded-xl border border-slate-200"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setThumbnail(photo.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            photo.isThumb
                              ? "bg-[#F7941D] text-white"
                              : "bg-white/20 text-white hover:bg-[#F7941D]"
                          }`}
                          title="Jadikan thumbnail"
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removePhoto(photo.id)}
                          className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-red-500 transition-colors"
                          title="Hapus foto"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {/* Thumbnail badge */}
                      {photo.isThumb && (
                        <div className="absolute top-1.5 left-1.5 bg-[#F7941D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Thumbnail
                        </div>
                      )}
                      {/* Caption input */}
                      <input
                        type="text"
                        value={photo.caption}
                        onChange={(e) => updateCaption(photo.id, e.target.value)}
                        placeholder="Caption foto..."
                        className="mt-1.5 w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 focus:ring-1 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pb-6">
            <Link
              href="/admin/dokumentasi"
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#005BAA] hover:bg-[#003F7D] text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-60"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Simpan Dokumentasi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
