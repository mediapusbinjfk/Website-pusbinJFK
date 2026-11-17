"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  MessageCircleQuestion,
  ArrowUpRight,
  ArrowRight,
  BookOpenCheck,
  Database,
  CalendarCheck2,
  ExternalLink,
} from "lucide-react";

export const MainServices: React.FC = () => {
  return (
    <section id="main-services" className="relative py-20 lg:py-28 overflow-hidden bg-[#F8FAFC]">
      {/* Background Subtle Ambience */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#044085]/20 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-[#005BAA]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-[#044085] tracking-tight leading-tight">
            Layanan Utama & Ekosistem Digital
          </h2>
          <p className="mt-3 text-slate-600 text-base leading-relaxed">
            Portal terintegrasi bagi seluruh pejabat fungsional penanggulangan bencana di tingkat pusat maupun daerah.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Bento 1: Produk Hukum (Flagship Hero Tile - 7 cols) */}
          <div
            className="lg:col-span-7 rounded-3xl p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between shadow-xl group border border-slate-700/20"
            style={{
              background: "linear-gradient(135deg, #044085 0%, #022752 100%)",
            }}
          >
            {/* Ambient Background Graphic */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#005BAA]/40 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#F7941D]/15 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#F7941D] shadow-inner">
                  <FileText className="w-7 h-7" />
                </div>
                <span className="px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
                  Database Regulasi
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight">
                Produk Hukum & Juknis
              </h3>
              <p className="text-slate-200/90 text-sm sm:text-base leading-relaxed max-w-xl mb-6">
                Pusat repositori resmi regulasi jabatan fungsional kebencanaan, standar kompetensi kerja, petunjuk teknis penilaian kinerja, dan surat edaran BNPB.
              </p>

              {/* Tag filters preview */}
              <div className="flex flex-wrap gap-2 mb-8">
                {["PERBAN BNPB", "PermenPANRB", "Petunjuk Teknis", "Surat Edaran"].map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-lg bg-white/10 text-slate-200 text-xs font-medium border border-white/10">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between">
              <Link
                href="/layanan/produk-hukum"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F7941D] hover:bg-[#e08212] text-white font-bold text-sm shadow-lg shadow-orange-950/30 transition-all duration-200 active:scale-[0.98]"
              >
                <span>Buka Repositori Dokumen</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-xs text-slate-300 font-medium hidden sm:inline">
                Akses Terbuka & Unduh PDF
              </span>
            </div>
          </div>

          {/* Bento 2: Konsultasi (Action Tile - 5 cols) */}
          <div className="lg:col-span-5 rounded-3xl p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between shadow-xl group border border-amber-200/60 bg-white">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#F7941D]" />
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#FFF7ED] rounded-full blur-xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF7ED] border border-[#FFE4B0] flex items-center justify-center text-[#F7941D] shadow-sm">
                  <MessageCircleQuestion className="w-7 h-7" />
                </div>
                <span className="px-3.5 py-1 rounded-full bg-[#FFF7ED] border border-[#FFE4B0] text-[#d97c08] text-xs font-bold uppercase tracking-wider">
                  Layanan Bantuan
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-[#0f1f3d] mb-3 tracking-tight">
                Layanan Konsultasi
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Fasilitas pendampingan teknis, konsultasi kenaikan jenjang, angka kredit, serta bimbingan fungsional secara daring & luring.
              </p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 mb-6 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CalendarCheck2 className="w-4 h-4 text-[#005BAA]" />
                  <span>Jadwal Sesi Terbuka Setiap Hari Kerja</span>
                </div>
                <p className="text-xs text-slate-500">
                  Respon terkoordinasi langsung oleh tim kerja Pusat Pembinaan JF.
                </p>
              </div>
            </div>

            <div className="relative z-10 pt-4 border-t border-slate-100">
              <Link
                href="/layanan/konsultasi"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#005BAA] hover:bg-[#004582] text-white font-bold text-sm shadow-md shadow-blue-900/20 transition-all duration-200 active:scale-[0.98]"
              >
                <span>Ajukan Permohonan Konsultasi</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Bento 3: SIUKOM (6 cols) */}
          <div className="lg:col-span-6 rounded-3xl p-7 relative overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#005BAA] shrink-0">
                <BookOpenCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-[#0f1f3d]">SIUKOM BNPB</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#005BAA] border border-blue-100">Portal Eksternal</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Sistem Informasi Uji Kompetensi resmi untuk registrasi, verifikasi berkas portofolio, dan sertifikasi jenjang karir.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <a
                href="https://siukom.bnpb.go.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#005BAA] hover:text-[#F7941D] transition-colors"
              >
                <span>Kunjungi siukom.bnpb.go.id</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-xs text-slate-400 font-medium">Layanan BKN / BNPB</span>
            </div>
          </div>

          {/* Bento 4: Portal Data JF (6 cols) */}
          <div className="lg:col-span-6 rounded-3xl p-7 relative overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFF7ED] border border-[#FFE4B0] flex items-center justify-center text-[#F7941D] shrink-0">
                <Database className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-bold text-[#0f1f3d]">Portal Data JF Kebencanaan</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-50 text-[#d97c08] border border-orange-100">Database</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Pusat pendataan aparatur penata dan analis kebencanaan seluruh Indonesia guna pemetaan formasi dan redistribusi keahlian.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <a
                href="https://script.google.com/macros/s/AKfycbz129kVvvjvr82HjulfmHsOv6crXkNeuEDoUKRo6jIa2qy8L-f9xtEsnTSEQsClAXI0/exec"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#005BAA] hover:text-[#F7941D] transition-colors"
              >
                <span>Buka Dashboard Data JF</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-xs text-slate-400 font-medium">Data Terpadu</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
