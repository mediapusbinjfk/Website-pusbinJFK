import React from "react";
import Link from "next/link";
import { ArrowLeft, Home, FileText, Search, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-[#F8FAFC]">
      <div className="max-w-xl w-full text-center space-y-6">
        
        {/* Badge & Code */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-[#005BAA] border border-blue-200 text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          Halaman Tidak Ditemukan
        </div>

        <h1 className="text-7xl sm:text-8xl font-extrabold text-[#044085] tracking-tight">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
            Halaman yang Anda cari tidak tersedia
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Alamat URL yang Anda tuju mungkin salah ketik, telah dipindahkan, atau tidak lagi dapat diakses publik.
          </p>
        </div>

        {/* Quick Action Links */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#005BAA] hover:bg-[#004787] text-white text-sm font-bold shadow-md shadow-blue-900/15 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <Link
            href="/layanan/produk-hukum"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-semibold shadow-sm transition-all"
          >
            <FileText className="w-4 h-4 text-[#005BAA]" />
            <span>Cari Produk Hukum</span>
          </Link>
        </div>

        {/* Secondary Links */}
        <div className="pt-6 border-t border-slate-200/80 text-xs text-slate-400">
          Butuh bantuan? Silakan ajukan pertanyaan melalui{" "}
          <Link href="/layanan/konsultasi" className="text-[#005BAA] font-semibold hover:underline">
            Layanan Konsultasi Resmi
          </Link>
          .
        </div>
      </div>
    </div>
  );
}

