"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Minus, ArrowRight } from "lucide-react";

const MILESTONES = [
  {
    year: "2019",
    label: "Inisiasi",
    title: "Transformasi Birokrasi ASN",
    regulasi: "Pidato Kenegaraan 20 Oktober 2019",
    body: "Presiden RI mengarahkan pemangkasan eselonisasi birokrasi menjadi dua tingkat. ASN didorong bertransformasi ke jabatan fungsional berbasis kompetensi teknis, membuka jalan bagi lahirnya Jabatan Fungsional Kebencanaan.",
  },
  {
    year: "2020",
    label: "Regulasi",
    title: "Penetapan Jabatan Fungsional",
    regulasi: "PermenPANRB No. 87 & 88 Tahun 2020",
    body: "Kementerian PANRB mengesahkan dua jabatan fungsional resmi: Analis Kebencanaan dan Penata Penanggulangan Bencana, dengan BNPB sebagai instansi pembina nasional. Mencakup 4 jenjang keahlian dari Ahli Pertama hingga Ahli Utama.",
  },
  {
    year: "2023",
    label: "Modernisasi",
    title: "Reformasi Sistem Kinerja",
    regulasi: "PermenPANRB No. 1/2023 & UU ASN No. 20/2023",
    body: "Sistem DUPAK manual ditiadakan. Angka kredit kini diperoleh otomatis dari konversi predikat penilaian kinerja (SKP) tahunan. ASN fokus pada dampak nyata di lapangan, bukan pengumpulan berkas administratif.",
  },
  {
    year: "2025",
    label: "Kelembagaan",
    title: "Pengukuhan PUSBIN JF Kebencanaan",
    regulasi: "PERBAN BNPB No. 11 Tahun 2025",
    body: "BNPB meresmikan Pusat Pembinaan Jabatan Fungsional Kebencanaan sebagai otoritas pengampu tunggal. Bertanggung jawab atas standar kompetensi, kurikulum pelatihan, uji kompetensi, dan sertifikasi aparatur se-Indonesia.",
  },
];

export const SejarahPreview: React.FC = () => {
  const [openYear, setOpenYear] = useState<string | null>(null);

  const toggle = (year: string) => {
    setOpenYear((prev) => (prev === year ? null : year));
  };

  return (
    <section data-reveal="section" className="py-20 border-t border-slate-100 bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-[#044085] tracking-tight">
            Sejarah Pembentukan
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Klik tahun untuk melihat tonggak penting perjalanan JF Kebencanaan.
          </p>
        </div>

        {/* Accordion List */}
        <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
          {MILESTONES.map((item) => {
            const isOpen = openYear === item.year;
            return (
              <div key={item.year}>
                <button
                  onClick={() => toggle(item.year)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors duration-150 cursor-pointer group"
                >
                  <div className="flex items-center gap-5">
                    {/* Year */}
                    <span
                      className={`text-xl font-bold tabular-nums w-14 shrink-0 transition-colors duration-200 ${
                        isOpen ? "text-[#005BAA]" : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    >
                      {item.year}
                    </span>

                    {/* Title */}
                    <div>
                      <span
                        className={`block text-sm font-semibold transition-colors duration-200 ${
                          isOpen ? "text-slate-900" : "text-slate-700"
                        }`}
                      >
                        {item.title}
                      </span>
                      <span className="block text-xs text-slate-400 mt-0.5">
                        {item.label}
                      </span>
                    </div>
                  </div>

                  {/* Toggle Icon */}
                  <span className={`shrink-0 transition-colors duration-200 ${isOpen ? "text-[#005BAA]" : "text-slate-400"}`}>
                    {isOpen ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </span>
                </button>

                {/* Expandable Content — CSS grid animation */}
                <div className={`accordion-body ${isOpen ? "is-open" : ""}`}>
                  <div className="accordion-inner">
                    <div className="px-6 pb-6 ml-[76px]">
                      <p className="text-sm text-slate-600 leading-relaxed mb-3">
                        {item.body}
                      </p>
                      <span className="inline-block text-xs text-[#005BAA] font-medium bg-blue-50 px-2.5 py-1 rounded-md">
                        {item.regulasi}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Link */}
        <div className="mt-6 flex justify-end">
          <Link
            href="/profil/sejarah"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#005BAA] transition-colors duration-200 group"
          >
            Lihat kronologi lengkap
            <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

      </div>
    </section>
  );
};
