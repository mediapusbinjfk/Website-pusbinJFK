"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageTransition } from "@/components/ui/PageTransition";
import {
  Flag,
  Shield,
  Award,
  History,
  Landmark,
  CheckCircle2,
  ArrowRight,
  Search,
  FileText,
  ChevronDown,
  ChevronUp,
  Layers,
  TrendingUp,
  Building2,
  Scale,
  Users2,
  FileCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  year: string;
  dateStr: string;
  category: "Inisiasi" | "Regulasi" | "Modernisasi" | "Kelembagaan";
  phaseTitle: string;
  title: string;
  legalRef: string;
  shortDesc: string;
  policyContext: string;
  impactDesc: string;
  keyMetrics: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const TIMELINE_DATA: TimelineEvent[] = [
  {
    id: "2019-inisiasi",
    year: "2019",
    dateStr: "20 Oktober 2019",
    category: "Inisiasi",
    phaseTitle: "Tahap I: Arah Reformasi Birokrasi",
    title: "Arahan Presiden RI Mengenai Penyederhanaan Birokrasi",
    legalRef: "Pidato Pelantikan Presiden RI Periode 2019–2024",
    shortDesc: "Arah transformasi birokrasi ASN dari struktural kaku beralih ke jabatan fungsional berbasis keahlian teknis.",
    policyContext:
      "Dalam pidato pelantikan Presiden Joko Widodo pada 20 Oktober 2019, pemerintah menetapkan prioritas pemangkasan eselonisasi birokrasi menjadi hanya dua tingkat. ASN diarahkan bertransformasi ke jabatan fungsional yang menghargai kompetensi teknis profesional guna mewujudkan tata kelola birokrasi yang lincah, adaptif, dan responsif terhadap dinamika lapangan.",
    impactDesc:
      "Menjadi landasan pendorong bagi BNPB untuk merancang jabatan fungsional khusus penanggulangan bencana, agar pejabat teknis di pusat maupun daerah memiliki kepastian jenjang profesi yang terlindungi secara regulasi.",
    keyMetrics: ["Pengalihan Eselon III & IV", "Fondasi Awal JF Kebencanaan"],
    icon: Flag,
  },
  {
    id: "2020-regulasi",
    year: "2020",
    dateStr: "November 2020",
    category: "Regulasi",
    phaseTitle: "Tahap II: Fondasi Hukum Formil",
    title: "Penetapan PermenPANRB No. 87 & 88 Tahun 2020",
    legalRef: "PermenPANRB Nomor 87 & 88 Tahun 2020",
    shortDesc: "Pengesahan resmi JF Analis Kebencanaan dan JF Penata Penanggulangan Bencana dengan BNPB sebagai instansi pembina.",
    policyContext:
      "Kementerian PANRB secara resmi mengundangkan PermenPANRB No. 87/2020 tentang Jabatan Fungsional Analis Kebencanaan (rumpun penelitian dan analisis kebijakan risiko) dan PermenPANRB No. 88/2020 tentang Jabatan Fungsional Penata Penanggulangan Bencana (rumpun teknis operasional penanganan bencana).",
    impactDesc:
      "Memberikan payung hukum nasional bagi ribuan pegawai di BNPB dan BPBD seluruh provinsi/kabupaten/kota. Mengatur 4 jenjang keahlian: Ahli Pertama, Ahli Muda, Ahli Madya, dan Ahli Utama.",
    keyMetrics: ["2 Rumpun Resmi Terbentuk", "4 Jenjang Formasi Keahlian", "Berlaku di Pusat & Daerah"],
    icon: Shield,
  },
  {
    id: "2021-penyetaraan",
    year: "2021",
    dateStr: "Juni 2021",
    category: "Regulasi",
    phaseTitle: "Tahap III: Penyetaraan Struktur Organisasi",
    title: "Implementasi PermenPANRB 25/2021 & Penyetaraan Jabatan",
    legalRef: "PermenPANRB Nomor 25 Tahun 2021",
    shortDesc: "Pengalihan pejabat administrasi ke dalam JF Kebencanaan di lingkungan kementerian/lembaga dan pemerintah daerah.",
    policyContext:
      "Pemerintah menerbitkan PermenPANRB No. 25 Tahun 2021 sebagai pedoman penyederhanaan struktur organisasi melalui penyetaraan jabatan administrasi ke dalam jabatan fungsional. Kebijakan ini mempercepat migrasi pejabat eselon IV ke dalam rumpun JF penanggulangan bencana.",
    impactDesc:
      "Ratusan posisi struktural di BNPB dan BPBD se-Indonesia berhasil dikonversi menjadi fungsional Analis Kebencanaan dan Penata PB. Struktur organisasi menjadi lebih ramping (delayering) dengan koordinasi tim kerja yang lebih luwes.",
    keyMetrics: ["Penyetaraan Jabatan Berjalan", "Struktur Organisasi Efisien"],
    icon: Layers,
  },
  {
    id: "2023-kinerja",
    year: "2023",
    dateStr: "Tahun 2023",
    category: "Modernisasi",
    phaseTitle: "Tahap IV: Transformasi Tata Kelola Kinerja",
    title: "Reformasi Kinerja Lincah (PermenPANRB 1/2023 & UU ASN 20/2023)",
    legalRef: "PermenPANRB No. 1/2023 & UU No. 20/2023 tentang ASN",
    shortDesc: "Peniadaan butir DUPAK manual dan beralih ke konversi predikat kinerja tahunan yang adaptif dan terintegrasi.",
    policyContext:
      "Lahirnya PermenPANRB Nomor 1 Tahun 2023 dan Undang-Undang Nomor 20 Tahun 2023 tentang Aparatur Sipil Negara mengubah tata kelola JF secara fundamental. Sistem angka kredit konvensional berbasis butir kegiatan butir demi butir resmi ditiadakan dan diganti dengan konversi evaluasi kinerja berkala.",
    impactDesc:
      "Pejabat fungsional terbebas dari beban administratif pengumpulan berkas fisik DUPAK. Angka kredit diperoleh secara otomatis berdasarkan konversi predikat penilaian kinerja (SKP) tahunan, mendorong ASN fokus pada output penyelamatan jiwa dan pengurangan risiko bencana.",
    keyMetrics: ["DUPAK Fisik Ditiadakan", "Konversi Predikat Kinerja 100%", "Kerja Kolaboratif Agile"],
    icon: Award,
  },
  {
    id: "2025-pusbin",
    year: "2025",
    dateStr: "Desember 2025",
    category: "Kelembagaan",
    phaseTitle: "Tahap V: Pengukuhan Institusi Pengampu",
    title: "Peresmian Pusat Pembinaan Jabatan Fungsional (PUSBIN JF)",
    legalRef: "Peraturan BNPB & Keputusan Kepala BNPB Terkait Penguatan Kelembagaan PUSBIN",
    shortDesc: "Pengukuhan unit kerja khusus terpadu untuk membina, mensertifikasi, dan menjamin jenjang karir aparatur kebencanaan nasional.",
    policyContext:
      "Menjawab kebutuhan standardisasi kompetensi aparatur yang tersebar di seluruh Indonesia, BNPB meresmikan Pusat Pembinaan Jabatan Fungsional Kebencanaan (PUSBIN JF). PUSBIN bertindak sebagai otoritas pengampu tunggal dalam penyusunan kurikulum, rekomendasi formasi, uji kompetensi, dan akreditasi profesi.",
    impactDesc:
      "Memastikan setiap analis dan penata PB di pelosok nusantara memiliki akses setara terhadap pelatihan berkala, sertifikasi kompetensi bertaraf internasional, serta perlindungan profesi yang terintegrasi dalam ekosistem digital.",
    keyMetrics: ["Unit Pengampu Tunggal Mandiri", "Standarisasi Uji Kompetensi Nasional", "Ekosistem Karir Terpadu"],
    icon: History,
  },
];

const COMPARISON_MATRIX = [
  {
    topic: "Model Struktur & Peran Kerja",
    before: "Birokrasi hierarkis bertingkat (Eselon III & IV). Penugasan terpaku pada garis komando administratif yang kaku.",
    after: "Struktur lincah berbasis fungsional (Squad Team). Penugasan fleksibel dan lintas bidang berbasis keahlian teknis.",
    icon: Building2,
  },
  {
    topic: "Penilaian & Angka Kredit",
    before: "Sistem DUPAK konvensional. Pejabat disibukkan mengumpulkan ribuan lembar berkas bukti butir kegiatan fisik.",
    after: "Konversi langsung predikat kinerja (SKP). Beban administrasi berkurang drastis, dinilai dari dampak nyata lapangan.",
    icon: FileCheck,
  },
  {
    topic: "Standarisasi Kompetensi",
    before: "Pelatihan terfragmentasi di berbagai instansi tanpa kurikulum baku kebencanaan nasional.",
    after: "Uji kompetensi terstandarisasi di bawah PUSBIN JF BNPB dengan pengakuan kualifikasi profesi nasional.",
    icon: Scale,
  },
  {
    topic: "Pengelolaan & Pembinaan Karir",
    before: "Kenaikan pangkat bergantung pada ketersediaan kursi struktural yang terbatas dan rawan stagnasi.",
    after: "Jenjang karir terbuka dari Ahli Pertama hingga Ahli Utama dengan kepastian jenjang profesi yang terjamin.",
    icon: TrendingUp,
  },
];

export default function SejarahPage() {
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTabMode, setActiveTabMode] = useState<Record<string, "kebijakan" | "dampak">>({
    "2019-inisiasi": "kebijakan",
    "2020-regulasi": "kebijakan",
    "2021-penyetaraan": "kebijakan",
    "2023-kinerja": "kebijakan",
    "2025-pusbin": "kebijakan",
  });
  const [expandedLegal, setExpandedLegal] = useState<Record<string, boolean>>({});

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const categories = ["Semua", "Inisiasi", "Regulasi", "Modernisasi", "Kelembagaan"];

  const filteredEvents = useMemo(() => {
    return TIMELINE_DATA.filter((item) => {
      const matchCat = activeCategory === "Semua" || item.category === activeCategory;
      const matchSearch =
        searchQuery.trim() === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.legalRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.year.includes(searchQuery);
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const toggleTabMode = (id: string, mode: "kebijakan" | "dampak") => {
    setActiveTabMode((prev) => ({ ...prev, [id]: mode }));
  };

  const toggleLegalExpand = (id: string) => {
    setExpandedLegal((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const scrollToMilestone = (id: string) => {
    const el = cardRefs.current[id];
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <PageTransition>
      <div className="w-full bg-slate-50 min-h-screen">
        <PageHeader
          title="Sejarah & Kronologi Pembinaan JF Kebencanaan"
          description="Evolusi lengkap perumusan kebijakan, landasan hukum formil, dan pengukuhan Pusat Pembinaan Jabatan Fungsional BNPB."
          breadcrumbs={[
            { label: "Beranda", href: "/" },
            { label: "Profil" },
            { label: "Sejarah", href: "/profil/sejarah" },
          ]}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">

          {/* Interactive Navigation & Control Deck */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-8">
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#044085] tracking-tight">
                  Eksplorasi Tonggak Sejarah
                </h2>
                <p className="mt-1 text-slate-600 text-sm sm:text-base">
                  Gunakan navigasi interaktif di bawah untuk menyaring era regulasi atau meninjau lompatan sejarah aparatur kebencanaan.
                </p>
              </div>

              {/* Real-time Keyword Search */}
              <div className="relative w-full lg:w-80 shrink-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari regulasi, tahun, atau topik..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BAA]/30 focus:border-[#005BAA] transition-all bg-slate-50/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Interactive Timeline Stepper Strip */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Perjalanan Waktu</span>
                <span>Klik tahun untuk lompat ke tonggak</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {TIMELINE_DATA.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToMilestone(item.id)}
                    className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-[#005BAA]/5 hover:border-[#005BAA]/40 transition-all duration-200 group cursor-pointer text-center"
                  >
                    <span className="text-lg sm:text-xl font-black text-slate-800 group-hover:text-[#005BAA] transition-colors">
                      {item.year}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 line-clamp-1 mt-0.5">
                      {item.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-t border-slate-100 pt-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 shrink-0">
                Filter Era:
              </span>
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 cursor-pointer",
                      isActive
                        ? "bg-[#005BAA] text-white shadow-sm shadow-blue-500/20"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                    )}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Main Interactive Chronology List */}
          <div className="space-y-8">
            {filteredEvents.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <p className="text-slate-600 font-semibold">
                  Tidak ditemukan tonggak sejarah dengan kata kunci &quot;{searchQuery}&quot;.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("Semua");
                  }}
                  className="mt-4 px-5 py-2 rounded-xl bg-[#005BAA] text-white text-xs font-bold"
                >
                  Tampilkan Seluruh Sejarah
                </button>
              </div>
            ) : (
              filteredEvents.map((item, index) => {
                const Icon = item.icon;
                const activeMode = activeTabMode[item.id] || "kebijakan";
                const isLegalOpen = expandedLegal[item.id] || false;

                return (
                  <div
                    key={item.id}
                    ref={(el) => {
                      cardRefs.current[item.id] = el;
                    }}
                    id={item.id}
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative"
                  >
                    {/* Top colored accent indicator */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-[#044085] via-[#005BAA] to-[#F7941D]" />

                    <div className="p-6 sm:p-8 lg:p-10 space-y-6">
                      
                      {/* Milestone Header Metadata */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-[#005BAA]/10 text-[#005BAA] flex items-center justify-center shrink-0">
                            <Icon className="w-6 h-6 text-[#005BAA]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-black text-slate-900 tracking-tight">
                                {item.year}
                              </span>
                              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#005BAA]/10 text-[#005BAA]">
                                {item.category}
                              </span>
                            </div>
                            <span className="text-xs font-semibold text-slate-500">
                              {item.dateStr}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <span className="text-xs font-bold text-slate-400">
                            Tonggak #{index + 1}
                          </span>
                        </div>
                      </div>

                      {/* Title & Short Summary */}
                      <div>
                        <span className="text-xs font-bold text-[#F7941D] uppercase tracking-wider block mb-1">
                          {item.phaseTitle}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                          {item.shortDesc}
                        </p>
                      </div>

                      {/* Interactive Dual-View Mode Tabs */}
                      <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200/80 space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
                          <button
                            onClick={() => toggleTabMode(item.id, "kebijakan")}
                            className={cn(
                              "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                              activeMode === "kebijakan"
                                ? "bg-[#005BAA] text-white shadow-xs"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                            )}
                          >
                            Konteks Regulasi & Kebijakan
                          </button>
                          <button
                            onClick={() => toggleTabMode(item.id, "dampak")}
                            className={cn(
                              "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                              activeMode === "dampak"
                                ? "bg-[#005BAA] text-white shadow-xs"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                            )}
                          >
                            Dampak Nyata Aparatur PB
                          </button>
                        </div>

                        {/* Content Pane */}
                        <div className="text-sm text-slate-700 leading-relaxed">
                          {activeMode === "kebijakan" ? (
                            <p>{item.policyContext}</p>
                          ) : (
                            <p>{item.impactDesc}</p>
                          )}
                        </div>

                        {/* Key Achievement Metrics Pills */}
                        <div className="pt-2 flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-400 mr-1">Capaian:</span>
                          {item.keyMetrics.map((metric, mIdx) => (
                            <div
                              key={mIdx}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#F7941D]" />
                              <span>{metric}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Expandable Legal Reference Drawer */}
                      <div className="pt-2">
                        <button
                          onClick={() => toggleLegalExpand(item.id)}
                          className="flex items-center justify-between w-full p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-left group cursor-pointer"
                        >
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                            <FileText className="w-4 h-4 text-[#005BAA]" />
                            <span>Dasar Hukum & Dokumen Rujukan:</span>
                            <span className="text-[#005BAA] font-semibold">{item.legalRef}</span>
                          </div>

                          <div className="flex items-center gap-1 text-xs font-bold text-slate-400 group-hover:text-slate-600">
                            <span>{isLegalOpen ? "Tutup" : "Rincian Regulasi"}</span>
                            {isLegalOpen ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </button>

                        {isLegalOpen && (
                          <div className="mt-3 p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-xs text-slate-600 space-y-2 leading-relaxed">
                            <p>
                              Dokumen rujukan ini telah tersimpan dalam basis data repositori regulasi kepegawaian institusi. Pejabat fungsional dapat mengunduh dokumen salinan otentik melalui portal Produk Hukum.
                            </p>
                            <Link
                              href="/produk-hukum"
                              className="inline-flex items-center gap-1.5 font-bold text-[#005BAA] hover:underline pt-1"
                            >
                              <span>Buka Arsip Produk Hukum Regulasi</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Interactive Transformation Matrix: Sebelum vs Sesudah */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#044085] tracking-tight">
                Perbandingan Sebelum & Sesudah Terbentuknya PUSBIN JF
              </h2>
              <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-3xl leading-relaxed">
                Tinjauan komparatif mengenai perubahan tata kelola karir, sistem angka kredit, dan standar kompetensi aparatur penanggulangan bencana di Indonesia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {COMPARISON_MATRIX.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#005BAA]/10 text-[#005BAA] flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-extrabold text-base text-slate-900">
                        {item.topic}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-3 pt-2">
                      <div className="p-3.5 rounded-xl bg-white border border-red-100 text-xs leading-relaxed space-y-1">
                        <span className="font-bold text-red-600 block uppercase tracking-wider text-[10px]">
                          Era Konvensional (Sebelumnya)
                        </span>
                        <p className="text-slate-600">{item.before}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-blue-200 text-xs leading-relaxed space-y-1 shadow-2xs">
                        <span className="font-bold text-[#005BAA] block uppercase tracking-wider text-[10px]">
                          Era Pasca-PUSBIN JF Kebencanaan (Saat Ini)
                        </span>
                        <p className="text-slate-800 font-medium">{item.after}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Callout */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#044085] to-[#005BAA] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-lg font-bold">Ingin Mengajukan Pertanyaan Seputar Jenjang Karir JF?</h4>
                <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
                  Hubungi tim layanan PUSBIN JF BNPB untuk konsultasi terkait uji kompetensi, pengangkatan pertama, atau perpindahan jabatan.
                </p>
              </div>

              <Link
                href="/layanan/konsultasi"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#005BAA] hover:bg-blue-50 font-bold text-sm shadow-md transition-all shrink-0 active:scale-[0.98]"
              >
                <span>Layanan Konsultasi</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
