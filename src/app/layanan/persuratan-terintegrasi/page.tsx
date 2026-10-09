"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageTransition } from "@/components/ui/PageTransition";
import { Card } from "@/components/ui/Card";
import {
  Mail, Send, Search, CheckCircle2, ShieldCheck, HelpCircle,
  ExternalLink, FileText, ArrowRight, Clock, Building2, User,
  FileCheck, Shield, ChevronRight, AlertCircle, X, Download,
  Phone, Globe, Database, Sparkles, Lock
} from "lucide-react";

// Mock data tracking untuk simulasi cek progress
const MOCK_TRACKING_DATA: Record<string, {
  nomorSurat: string;
  pengirim: string;
  perihal: string;
  tanggalMasuk: string;
  statusSaatIni: string;
  stepActive: number;
  catatanDisposisi: string;
  timeline: { step: string; tanggal: string; status: "done" | "active" | "pending"; keterangan: string }[];
}> = {
  "AGENDA-2026-0814": {
    nomorSurat: "800/142/BPBD-JATIM/VIII/2026",
    pengirim: "BPBD Provinsi Jawa Timur",
    perihal: "Permohonan Rekomendasi Uji Kompetensi Kenaikan Jenjang JF PB Periode II",
    tanggalMasuk: "14 Agustus 2026",
    statusSaatIni: "Disposisi Pimpinan Unit Pembina",
    stepActive: 3,
    catatanDisposisi: "Berkas portofolio lengkap. Dilanjutkan ke Tim Asesor untuk penjadwalan uji kompetensi teknis.",
    timeline: [
      { step: "Surat Diterima", tanggal: "14 Ags 2026, 09:15 WIB", status: "done", keterangan: "Surat masuk terdaftar di loket digital dan terdistribusi ke agenda utama." },
      { step: "Verifikasi Berkas", tanggal: "15 Ags 2026, 11:30 WIB", status: "done", keterangan: "Verifikasi kelengkapan berkas administrasi dan dokumen usulan oleh tim sekretariat." },
      { step: "Disposisi Pimpinan", tanggal: "17 Ags 2026, 14:00 WIB", status: "active", keterangan: "Sedang dalam telaah Direktur/Ketua Unit Pembina untuk penerbitan surat tugas." },
      { step: "Selesai & Naskah Terbit", tanggal: "Estimasi 21 Ags 2026", status: "pending", keterangan: "Surat balasan resmi bertanda tangan elektronik (TTE) siap diunduh." },
    ],
  },
  "AGENDA-2026-0922": {
    nomorSurat: "B/112/BKPSDM-SMR/IX/2026",
    pengirim: "BKPSDM Kabupaten Sumedang",
    perihal: "Usulan Pengangkatan Pertama Pejabat Fungsional Penata Penanggulangan Bencana",
    tanggalMasuk: "22 September 2026",
    statusSaatIni: "Naskah Balasan Terbit (Selesai)",
    stepActive: 4,
    catatanDisposisi: "Rekomendasi teknis penetapan formasi telah disetujui dan naskah dinas telah diterbitkan.",
    timeline: [
      { step: "Surat Diterima", tanggal: "22 Sep 2026, 10:00 WIB", status: "done", keterangan: "Naskah dinas resmi telah diterima." },
      { step: "Verifikasi Berkas", tanggal: "23 Sep 2026, 13:45 WIB", status: "done", keterangan: "Syarat kualifikasi pendidikan dan formasi terpenuhi." },
      { step: "Disposisi Pimpinan", tanggal: "24 Sep 2026, 09:20 WIB", status: "done", keterangan: "Persetujuan rekomendasi teknis oleh pimpinan." },
      { step: "Selesai & Naskah Terbit", tanggal: "25 Sep 2026, 15:10 WIB", status: "done", keterangan: "Surat Rekomendasi No. B-452/BNPB/JF/09/2026 telah terbit dengan TTE BSrE." },
    ],
  },
};

export default function PersuratanTerintegrasiPage() {
  // State untuk form kirim surat
  const [activeTab, setActiveTab] = useState<"kirim" | "progress" | "keaslian" | "panduan">("progress");
  const [searchKode, setSearchKode] = useState("AGENDA-2026-0814");
  const [trackingResult, setTrackingResult] = useState<typeof MOCK_TRACKING_DATA[string] | null>(MOCK_TRACKING_DATA["AGENDA-2026-0814"]);
  const [searchError, setSearchError] = useState(false);

  // State form kirim surat
  const [kirimForm, setKirimForm] = useState({
    instansi: "",
    namaPengirim: "",
    email: "",
    telepon: "",
    nomorSurat: "",
    perihal: "",
    kategori: "Uji Kompetensi",
    catatan: "",
  });
  const [kirimSuccess, setKirimSuccess] = useState<string | null>(null);

  // State cek keaslian surat
  const [keaslianKode, setKeaslianKode] = useState("");
  const [keaslianResult, setKeaslianResult] = useState<{
    valid: boolean;
    nomorSurat: string;
    perihal: string;
    penandatangan: string;
    tanggalTte: string;
  } | null>(null);

  const handleCariProgress = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchKode.trim().toUpperCase();
    if (MOCK_TRACKING_DATA[query]) {
      setTrackingResult(MOCK_TRACKING_DATA[query]);
      setSearchError(false);
    } else {
      setTrackingResult(null);
      setSearchError(true);
    }
  };

  const handleKirimSurat = (e: React.FormEvent) => {
    e.preventDefault();
    const randomId = `AGENDA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setKirimSuccess(randomId);
    // Masukkan ke tracking mock agar langsung bisa dicek
    MOCK_TRACKING_DATA[randomId] = {
      nomorSurat: kirimForm.nomorSurat || "SURAT/OFFICIAL/2026",
      pengirim: kirimForm.instansi || "Instansi Pengirim",
      perihal: kirimForm.perihal || "Permohonan Persuratan Kedinasan",
      tanggalMasuk: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      statusSaatIni: "Surat Diterima di Loket Digital",
      stepActive: 1,
      catatanDisposisi: "Naskah dinas baru saja diajukan dan sedang dalam antrean verifikasi administrasi.",
      timeline: [
        { step: "Surat Diterima", tanggal: "Baru saja", status: "active", keterangan: "Naskah dinas terdaftar di loket digital persuratan terintegrasi." },
        { step: "Verifikasi Berkas", tanggal: "Menunggu antrean", status: "pending", keterangan: "Pengecekan kelengkapan lampiran dan nomor surat." },
        { step: "Disposisi Pimpinan", tanggal: "Menunggu", status: "pending", keterangan: "Penerusan naskah ke pimpinan unit kerja teknis." },
        { step: "Selesai & Naskah Terbit", tanggal: "Estimasi 3-5 hari kerja", status: "pending", keterangan: "Penerbitan surat jawaban atau rekomendasi resmi." },
      ],
    };
  };

  const handleCekKeaslian = (e: React.FormEvent) => {
    e.preventDefault();
    if (keaslianKode.trim().length > 3) {
      setKeaslianResult({
        valid: true,
        nomorSurat: "B-452/BNPB/JF.02/09/2026",
        perihal: "Rekomendasi Teknis Kenaikan Jenjang Jabatan Fungsional Kebencanaan",
        penandatangan: "Direktur Pembinaan Jabatan Fungsional BNPB",
        tanggalTte: "25 September 2026, 14:22:08 WIB",
      });
    } else {
      setKeaslianResult(null);
    }
  };

  return (
    <PageTransition>
      <div className="w-full bg-slate-50 min-h-screen">
        {/* Page Header */}
        <PageHeader
          title="Layanan Persuratan Terintegrasi"
          description="Platform digital tata kelola naskah dinas, disposisi elektronik, pelacakan surat dinas, dan integrasi kearsipan resmi JF BNPB."
          breadcrumbs={[
            { label: "Beranda", href: "/" },
            { label: "Layanan" },
            { label: "Persuratan Terintegrasi", href: "/layanan/persuratan-terintegrasi" },
          ]}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
          
          {/* ============================================================ */}
          {/* HERO BANNER - INSPIRASI MAPANRB */}
          {/* ============================================================ */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#003F7D] via-[#005BAA] to-[#0468bd] text-white shadow-xl p-8 sm:p-12 border border-blue-400/20">
            {/* Background geometric & glow */}
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute right-10 bottom-0 w-80 h-80 bg-[#F7941D]/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-[#F7941D]" />
                  Tata Kelola Persuratan Digital SPBE
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  Keterpaduan Persuratan & Disposisi Naskah Dinas JF BNPB
                </h2>
                <p className="text-sm sm:text-base text-blue-100 max-w-2xl leading-relaxed">
                  Menghadirkan layanan persuratan kedinasan yang <strong>Cepat, Mudah, dan Aman</strong> bagi pemerintah daerah, 
                  BPBD seluruh Indonesia, instansi pengusul, dan pejabat fungsional. Layanan ini terhubung langsung dengan sistem kearsipan dinamis terintegrasi nasional.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab("progress")}
                    className="px-5 py-2.5 rounded-xl bg-white text-[#005BAA] hover:bg-blue-50 font-bold text-sm shadow-md transition-all hover:scale-105 active:scale-95"
                  >
                    Lacak Status Surat
                  </button>
                  <button
                    onClick={() => setActiveTab("kirim")}
                    className="px-5 py-2.5 rounded-xl bg-[#F7941D] hover:bg-[#E07B00] text-white font-bold text-sm shadow-md transition-all hover:scale-105 active:scale-95"
                  >
                    Kirim Surat Digital
                  </button>
                  <a
                    href="#srikandi-section"
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-sm transition-all"
                  >
                    Menuju SRIKANDI ↓
                  </a>
                </div>
              </div>

              {/* Info Box Banner */}
              <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-[#F7941D]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white">Terverifikasi BSrE</h4>
                    <p className="text-xs text-blue-100">Tanda Tangan Elektronik Resmi</p>
                  </div>
                </div>
                <p className="text-xs text-blue-100 leading-relaxed pt-1">
                  Seluruh naskah dinas rekomendasi dan jawaban persuratan unit pembina dilengkapi pengamanan tanda tangan elektronik tersertifikasi Balai Sertifikasi Elektronik (BSrE - BSSN).
                </p>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 4 MENU LAYANAN PERSURATAN UTAMA (MAPANRB STYLE) */}
          {/* ============================================================ */}
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-slate-900">Layanan Persuratan Utama</h3>
              <p className="text-sm text-slate-500 mt-1">
                Akses cepat modul administrasi persuratan kedinasan Jabatan Fungsional BNPB
              </p>
            </div>

            {/* Tab navigation buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => setActiveTab("kirim")}
                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all duration-200 text-left cursor-pointer ${
                  activeTab === "kirim"
                    ? "bg-[#005BAA] text-white border-[#005BAA] shadow-md shadow-blue-900/20 scale-[1.02]"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className={`p-3 rounded-xl ${activeTab === "kirim" ? "bg-white/20 text-white" : "bg-blue-50 text-[#005BAA]"}`}>
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Kirim Surat</h4>
                  <p className={`text-xs ${activeTab === "kirim" ? "text-blue-100" : "text-slate-400"}`}>Unggah naskah dinas</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("progress")}
                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all duration-200 text-left cursor-pointer ${
                  activeTab === "progress"
                    ? "bg-[#005BAA] text-white border-[#005BAA] shadow-md shadow-blue-900/20 scale-[1.02]"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className={`p-3 rounded-xl ${activeTab === "progress" ? "bg-white/20 text-white" : "bg-blue-50 text-[#005BAA]"}`}>
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Cek Progress</h4>
                  <p className={`text-xs ${activeTab === "progress" ? "text-blue-100" : "text-slate-400"}`}>Lacak disposisi surat</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("keaslian")}
                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all duration-200 text-left cursor-pointer ${
                  activeTab === "keaslian"
                    ? "bg-[#005BAA] text-white border-[#005BAA] shadow-md shadow-blue-900/20 scale-[1.02]"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className={`p-3 rounded-xl ${activeTab === "keaslian" ? "bg-white/20 text-white" : "bg-blue-50 text-[#005BAA]"}`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Cek Keaslian</h4>
                  <p className={`text-xs ${activeTab === "keaslian" ? "text-blue-100" : "text-slate-400"}`}>Validasi naskah dinas</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("panduan")}
                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all duration-200 text-left cursor-pointer ${
                  activeTab === "panduan"
                    ? "bg-[#005BAA] text-white border-[#005BAA] shadow-md shadow-blue-900/20 scale-[1.02]"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className={`p-3 rounded-xl ${activeTab === "panduan" ? "bg-white/20 text-white" : "bg-blue-50 text-[#005BAA]"}`}>
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Bantuan</h4>
                  <p className={`text-xs ${activeTab === "panduan" ? "text-blue-100" : "text-slate-400"}`}>Panduan & format</p>
                </div>
              </button>
            </div>

            {/* TAB CONTENT AREA */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              
              {/* TAB 1: KIRIM SURAT */}
              {activeTab === "kirim" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">Kirim Surat Dinas Digital</h4>
                      <p className="text-sm text-slate-500">Ajukan surat resmi, usulan, atau permohonan ke Unit Pembina JF BNPB</p>
                    </div>
                    <span className="text-xs bg-blue-50 text-[#005BAA] px-3 py-1.5 rounded-full font-semibold border border-blue-200 self-start sm:self-auto">
                      Format Naskah: PDF (Maks. 20 MB)
                    </span>
                  </div>

                  {kirimSuccess ? (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900">Surat Berhasil Dikirim & Terdaftar!</h4>
                      <p className="text-sm text-slate-600 max-w-lg mx-auto">
                        Naskah dinas Anda telah berhasil masuk ke loket persuratan terintegrasi JF BNPB. Silakan simpan nomor agenda berikut untuk melacak progres disposisi:
                      </p>
                      <div className="inline-block bg-white px-6 py-3 rounded-xl border border-green-300 font-mono text-xl font-extrabold text-green-700 shadow-sm">
                        {kirimSuccess}
                      </div>
                      <div className="pt-2 flex justify-center gap-3">
                        <button
                          onClick={() => {
                            setSearchKode(kirimSuccess);
                            setActiveTab("progress");
                            setTrackingResult(MOCK_TRACKING_DATA[kirimSuccess]);
                            setKirimSuccess(null);
                          }}
                          className="px-5 py-2.5 rounded-xl bg-[#005BAA] text-white font-semibold text-sm hover:bg-[#004787] transition-all"
                        >
                          Lacak Surat Sekarang →
                        </button>
                        <button
                          onClick={() => setKirimSuccess(null)}
                          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all"
                        >
                          Kirim Surat Lain
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleKirimSurat} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                            Instansi / Lembaga Pengirim <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: BPBD Provinsi Jawa Barat / BKPSDM Kab. Bogor"
                            value={kirimForm.instansi}
                            onChange={(e) => setKirimForm({ ...kirimForm, instansi: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                            Nama PIC / Narahubung <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Nama pejabat atau staf pengirim surat"
                            value={kirimForm.namaPengirim}
                            onChange={(e) => setKirimForm({ ...kirimForm, namaPengirim: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                            Nomor WhatsApp PIC <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="0812xxxxxxxx (untuk notifikasi progres disposisi)"
                            value={kirimForm.telepon}
                            onChange={(e) => setKirimForm({ ...kirimForm, telepon: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                            Email Kedinasan PIC <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="nama@instansi.go.id"
                            value={kirimForm.email}
                            onChange={(e) => setKirimForm({ ...kirimForm, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                            Nomor Surat Resmi <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: 800/123/BPBD/X/2026"
                            value={kirimForm.nomorSurat}
                            onChange={(e) => setKirimForm({ ...kirimForm, nomorSurat: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                            Kategori Permohonan <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={kirimForm.kategori}
                            onChange={(e) => setKirimForm({ ...kirimForm, kategori: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm transition-all bg-white"
                          >
                            <option value="Uji Kompetensi">Uji Kompetensi (UKOM) & Asesmen</option>
                            <option value="Penetapan Formasi">Pemberian Rekomendasi / Kebutuhan Formasi</option>
                            <option value="PAK & Angka Kredit">Verifikasi & Konversi Angka Kredit (PAK)</option>
                            <option value="Bimbingan Teknis">Permohonan Narasumber / Bimbingan Teknis</option>
                            <option value="Konsultasi Regulasi">Konsultasi Kebijakan & Regulasi JF</option>
                            <option value="Lainnya">Surat Dinas Lainnya</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                          Perihal Surat <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ringkasan perihal naskah dinas yang diajukan"
                          value={kirimForm.perihal}
                          onChange={(e) => setKirimForm({ ...kirimForm, perihal: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                          Unggah Berkas Naskah Dinas (PDF) <span className="text-red-500">*</span>
                        </label>
                        <div className="border-2 border-dashed border-slate-200 hover:border-[#005BAA] rounded-2xl p-6 text-center transition-all bg-slate-50/50">
                          <FileText className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                          <p className="text-sm font-semibold text-slate-700">Pilih file PDF atau seret ke sini</p>
                          <p className="text-xs text-slate-400 mt-1">Maksimal ukuran file 20 MB (PDF resmi bertanda tangan dan stempel/TTE)</p>
                          <input type="file" accept=".pdf" className="mt-3 text-xs text-slate-500" />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="reset"
                          className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all"
                        >
                          Reset Form
                        </button>
                        <button
                          type="submit"
                          className="px-8 py-3 rounded-xl bg-[#005BAA] hover:bg-[#004787] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          Kirim Surat Sekarang
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 2: CEK PROGRESS & DISPOSISI */}
              {activeTab === "progress" && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-slate-900">Cek Status & Progres Surat Dinas</h4>
                    <p className="text-sm text-slate-500">
                      Masukkan Nomor Agenda Surat yang Anda terima untuk memantau alur disposisi secara real-time.
                    </p>
                  </div>

                  {/* Search bar */}
                  <form onSubmit={handleCariProgress} className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Contoh: AGENDA-2026-0814 atau AGENDA-2026-0922"
                        value={searchKode}
                        onChange={(e) => setSearchKode(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm transition-all font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-8 py-3.5 rounded-2xl bg-[#005BAA] hover:bg-[#004787] text-white font-bold text-sm shadow-md transition-all shrink-0 flex items-center justify-center gap-2"
                    >
                      <Search className="w-4 h-4" />
                      Lacak Surat
                    </button>
                  </form>

                  {/* Quick test buttons */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>Contoh nomor agenda instan:</span>
                    <button
                      type="button"
                      onClick={() => { setSearchKode("AGENDA-2026-0814"); setTrackingResult(MOCK_TRACKING_DATA["AGENDA-2026-0814"]); setSearchError(false); }}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#005BAA] hover:bg-blue-100 font-mono font-semibold"
                    >
                      AGENDA-2026-0814 (Proses)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSearchKode("AGENDA-2026-0922"); setTrackingResult(MOCK_TRACKING_DATA["AGENDA-2026-0922"]); setSearchError(false); }}
                      className="px-2.5 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 font-mono font-semibold"
                    >
                      AGENDA-2026-0922 (Selesai)
                    </button>
                  </div>

                  {/* Search Error */}
                  {searchError && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-800 text-sm">
                      <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-semibold">Nomor Agenda Tidak Ditemukan</p>
                        <p className="text-xs text-amber-700 mt-0.5">
                          Pastikan kode agenda yang dimasukkan sudah benar atau coba klik contoh kode di atas.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tracking Detail Card */}
                  {trackingResult && (
                    <div className="space-y-6 pt-2">
                      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                          <div>
                            <span className="text-xs font-mono font-bold text-[#005BAA] bg-blue-100/70 px-2.5 py-1 rounded-md">
                              {searchKode.toUpperCase()}
                            </span>
                            <h5 className="text-base font-bold text-slate-900 mt-2">{trackingResult.perihal}</h5>
                          </div>
                          <span className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold ${
                            trackingResult.stepActive === 4 ? "bg-green-100 text-green-700" : "bg-blue-100 text-[#005BAA]"
                          }`}>
                            {trackingResult.statusSaatIni}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                          <div>
                            <span className="text-slate-400 block">Nomor Surat Asal</span>
                            <span className="font-semibold text-slate-800 font-mono">{trackingResult.nomorSurat}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Instansi Pengirim</span>
                            <span className="font-semibold text-slate-800">{trackingResult.pengirim}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Tanggal Masuk</span>
                            <span className="font-semibold text-slate-800">{trackingResult.tanggalMasuk}</span>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600">
                          <strong className="text-slate-800">Catatan Disposisi Terakhir:</strong> {trackingResult.catatanDisposisi}
                        </div>
                      </div>

                      {/* Timeline Visual */}
                      <div className="space-y-4">
                        <h5 className="font-bold text-sm text-slate-900">Alur Riwayat Disposisi:</h5>
                        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                          {trackingResult.timeline.map((step, idx) => (
                            <div key={idx} className="relative flex items-start gap-4">
                              {/* Circle pin */}
                              <div className={`absolute -left-6 sm:-left-8 top-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                step.status === "done"
                                  ? "bg-green-500 text-white shadow-sm shadow-green-300"
                                  : step.status === "active"
                                  ? "bg-[#005BAA] text-white ring-4 ring-blue-100"
                                  : "bg-slate-200 text-slate-400"
                              }`}>
                                {step.status === "done" ? "✓" : idx + 1}
                              </div>

                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h6 className="font-bold text-sm text-slate-800">{step.step}</h6>
                                  <span className="text-[11px] text-slate-400 font-mono">({step.tanggal})</span>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed">{step.keterangan}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: CEK KEASLIAN */}
              {activeTab === "keaslian" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-slate-900">Cek Keaslian Naskah Dinas Resmi</h4>
                    <p className="text-sm text-slate-500">
                      Verifikasi keabsahan dokumen rekomendasi, surat balasan, atau surat keputusan yang diterbitkan Unit Pembina JF BNPB.
                    </p>
                  </div>

                  <form onSubmit={handleCekKeaslian} className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Masukkan Kode Keaslian / Nomor Surat / Token TTE"
                        value={keaslianKode}
                        onChange={(e) => setKeaslianKode(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm transition-all font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-8 py-3.5 rounded-2xl bg-[#005BAA] hover:bg-[#004787] text-white font-bold text-sm shadow-md transition-all shrink-0 flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Verifikasi
                    </button>
                  </form>

                  {keaslianResult ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                          <h5 className="font-bold text-emerald-900 text-base">Dokumen Terverifikasi Asli & Sah</h5>
                          <p className="text-xs text-emerald-700">Tanda Tangan Elektronik Bersertifikasi BSrE</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-emerald-200">
                        <div>
                          <span className="text-emerald-700 block">Nomor Surat Resmi</span>
                          <span className="font-bold text-slate-900 font-mono text-sm">{keaslianResult.nomorSurat}</span>
                        </div>
                        <div>
                          <span className="text-emerald-700 block">Tanggal Penandatanganan (TTE)</span>
                          <span className="font-bold text-slate-900">{keaslianResult.tanggalTte}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-emerald-700 block">Perihal Dokumen</span>
                          <span className="font-semibold text-slate-800">{keaslianResult.perihal}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-emerald-700 block">Pejabat Penandatangan</span>
                          <span className="font-semibold text-slate-800">{keaslianResult.penandatangan}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      Masukkan kode atau nomor surat di atas untuk melihat detail validitas dokumen resmi.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: PANDUAN & BANTUAN */}
              {activeTab === "panduan" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">Panduan & Tata Naskah Dinas</h4>
                    <p className="text-sm text-slate-500">Standar operasional prosedur pengiriman dan penerimaan naskah dinas JF BNPB</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <h5 className="font-bold text-sm text-[#005BAA]">1. Ketentuan Naskah Usulan UKOM</h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Surat usulan wajib ditandatangani oleh Pejabat Pembina Kepegawaian (PPK) atau PyB (Sekda/Kepala BKPSDM/Kepala Pelaksana BPBD) dilengkapi lampiran daftar nominatif dan portofolio.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <h5 className="font-bold text-sm text-[#005BAA]">2. Ketentuan Usulan Rekomendasi Formasi</h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Menyertakan peta jabatan, analisis beban kerja (ABK), dan SK penetapan formasi eksisting dari instansi pembina daerah.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <h5 className="font-bold text-sm text-[#005BAA]">3. Waktu Pelayanan Disposisi</h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Proses telaah dan penerbitan disposisi naskah dinas diproses pada hari kerja (Senin - Jumat, pukul 08.00 - 16.00 WIB) maksimal 5 hari kerja setelah dokumen dinyatakan lengkap.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <h5 className="font-bold text-sm text-[#005BAA]">4. Layanan Helpdesk & Asistensi</h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Apabila memerlukan asistensi format surat dan verifikasi berkas, Anda dapat menghubungi helpdesk persuratan resmi di nomor WhatsApp Layanan Unit Pembina.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* ============================================================ */}
          {/* EKOSISTEM LAYANAN TERHUBUNG (INSPIRASI MAPANRB) */}
          {/* ============================================================ */}
          <div className="space-y-6 pt-4">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-slate-900">Ekosistem Layanan Terintegrasi</h3>
              <p className="text-sm text-slate-500 mt-1">
                Keterhubungan aplikasi dan portal resmi dalam tata kelola pembinaan aparatur kebencanaan
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a
                href="https://siukom.bnpb.go.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 bg-white rounded-2xl border border-slate-200 hover:border-[#005BAA] hover:shadow-md transition-all text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#005BAA] group-hover:bg-[#005BAA] group-hover:text-white transition-colors flex items-center justify-center mx-auto">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-slate-800 group-hover:text-[#005BAA]">SIUKOM BNPB</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">Sistem Uji Kompetensi</p>
                </div>
              </a>

              <a
                href="https://script.google.com/macros/s/AKfycbz129kVvvjvr82HjulfmHsOv6crXkNeuEDoUKRo6jIa2qy8L-f9xtEsnTSEQsClAXI0/exec"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 bg-white rounded-2xl border border-slate-200 hover:border-[#005BAA] hover:shadow-md transition-all text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#F7941D] group-hover:bg-[#F7941D] group-hover:text-white transition-colors flex items-center justify-center mx-auto">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-slate-800 group-hover:text-[#005BAA]">Portal Data JF</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">Basis Data Formasi Nasional</p>
                </div>
              </a>

              <Link
                href="/layanan/produk-hukum"
                className="group p-5 bg-white rounded-2xl border border-slate-200 hover:border-[#005BAA] hover:shadow-md transition-all text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-slate-800 group-hover:text-[#005BAA]">JDIH & Regulasi</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">Repositori Produk Hukum</p>
                </div>
              </Link>

              <a
                href="https://www.lapor.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 bg-white rounded-2xl border border-slate-200 hover:border-[#005BAA] hover:shadow-md transition-all text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors flex items-center justify-center mx-auto">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-slate-800 group-hover:text-[#005BAA]">SP4N LAPOR!</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">Pengaduan Pelayanan Publik</p>
                </div>
              </a>
            </div>
          </div>

          {/* ============================================================ */}
          {/* BAGIAN UTAMA YANG DIMINTA USER: TOMBOL MASUK KE LAYANAN SRIKANDI */}
          {/* ============================================================ */}
          <section id="srikandi-section" className="scroll-mt-24 pt-6">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-8 sm:p-12 border-2 border-amber-500/30 shadow-2xl">
              {/* Subtle background effects */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#005BAA]/30 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#F7941D]/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
                
                {/* Badge Tag */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Aplikasi Umum SPBE Bidang Kearsipan Dinamis Nasional
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                    Masuk ke Layanan Kearsipan Resmi <span className="text-amber-400">SRIKANDI</span>
                  </h3>
                  <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
                    Sistem Informasi Kearsipan Dinamis Terintegrasi (SRIKANDI) merupakan aplikasi umum SPBE yang dikembangkan 
                    bersama oleh <strong>KemenPANRB, Arsip Nasional RI (ANRI), Kominfo, dan BSSN</strong> untuk pengelolaan arsip dan naskah dinas elektronik seluruh instansi pemerintah di Indonesia.
                  </p>
                </div>

                {/* Info Pills */}
                <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300 pt-1">
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Single Sign-On SPBE
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Keamanan TTE BSrE
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Standar Kearsipan Nasional ANRI
                  </span>
                </div>

                {/* TOMBOL UTAMA MENJURUS KE SRIKANDI */}
                <div className="pt-4">
                  <a
                    href="https://srikandi.arsip.go.id/auth/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#F7941D] to-[#E07B00] hover:from-[#E07B00] hover:to-[#CC6D00] text-white font-extrabold text-base sm:text-lg shadow-xl shadow-orange-950/40 hover:scale-105 active:scale-95 transition-all duration-300 group border border-amber-300/40"
                  >
                    <span>Masuk ke Layanan SRIKANDI (Login Resmi)</span>
                    <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                </div>

                <p className="text-xs text-slate-400 pt-2">
                  Tautan di atas akan mengarahkan Anda langsung ke portal autentikasi resmi <code>srikandi.arsip.go.id</code>
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </PageTransition>
  );
}
