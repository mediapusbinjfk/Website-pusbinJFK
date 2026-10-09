"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { Flag, Shield, Award, History, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const MILESTONES = [
  {
    step: "01",
    year: "2019",
    phase: "Inisiasi",
    title: "Arahan Presiden RI",
    desc: "Arah transformasi birokrasi ASN berbasis keahlian teknis penanggulangan bencana.",
    highlight: "Penyederhanaan Birokrasi",
    icon: Flag,
  },
  {
    step: "02",
    year: "2020",
    phase: "Regulasi",
    title: "PermenPANRB 87 & 88",
    desc: "Landasan hukum resmi JF Analis Kebencanaan & JF Penata Penanggulangan Bencana.",
    highlight: "PermenPANRB 87 & 88/2020",
    icon: Shield,
  },
  {
    step: "03",
    year: "2023",
    phase: "Modernisasi",
    title: "Konversi Kinerja Lincah",
    desc: "Peralihan ke sistem kerja agile dan konversi predikat kinerja tahunan berbasis output.",
    highlight: "UU ASN & PermenPANRB 1/2023",
    icon: Award,
  },
  {
    step: "04",
    year: "2025",
    phase: "Kelembagaan",
    title: "Pembentukan PUSBIN",
    desc: "Peresmian Pusat Pembinaan JF Kebencanaan sebagai institusi pengampu nasional.",
    highlight: "PUSBIN JF Kebencanaan",
    icon: History,
  },
];

export const SejarahPreview: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeHover, setActiveHover] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 lg:py-20 bg-white border-b border-slate-200 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section: Simple, Clean, No Eyebrow */}
        <div
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6"
          style={{
            transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#044085] tracking-tight leading-tight">
              Sejarah Perjalanan JF Kebencanaan
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
              Tonggak evolusi pembinaan profesi aparatur penanggulangan bencana di Indonesia dari inisiasi reformasi hingga pengukuhan institusi nasional.
            </p>
          </div>

          <Link
            href="/profil/sejarah"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#005BAA] hover:bg-[#003F7D] text-white text-sm font-bold shadow-sm hover:shadow-md transition-all duration-200 shrink-0 group self-start md:self-auto active:scale-[0.98]"
          >
            <span>Lihat Detail Sejarah Lengkap</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>

        {/* 4 Connected Milestone Cards */}
        <div className="relative">
          {/* Connecting Track Line on Desktop */}
          <div className="hidden lg:block absolute top-[28px] left-12 right-12 h-[2px] bg-slate-200 -z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MILESTONES.map((m, idx) => {
              const Icon = m.icon;
              const isLast = idx === MILESTONES.length - 1;
              const isHovered = activeHover === idx;

              return (
                <div
                  key={m.year}
                  onMouseEnter={() => setActiveHover(idx)}
                  onMouseLeave={() => setActiveHover(null)}
                  style={{
                    transition: "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",
                    transitionDelay: `${idx * 80}ms`,
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(24px)",
                  }}
                  className="relative z-10"
                >
                  <div
                    className={cn(
                      "p-6 rounded-2xl border transition-all duration-300 bg-white flex flex-col justify-between h-full group",
                      isLast
                        ? "border-[#005BAA]/40 shadow-sm bg-gradient-to-b from-blue-50/30 to-white"
                        : "border-slate-200 hover:border-slate-300 hover:shadow-md",
                      isHovered ? "scale-[1.02] shadow-lg shadow-blue-900/5 border-[#005BAA]/50" : ""
                    )}
                  >
                    <div>
                      {/* Top Row: Year Node & Phase */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs transition-colors",
                              isLast
                                ? "bg-[#005BAA] text-white"
                                : "bg-slate-100 text-slate-700 group-hover:bg-[#005BAA] group-hover:text-white"
                            )}
                          >
                            {m.year.slice(-2)}
                          </span>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {m.phase}
                          </span>
                        </div>

                        <div className="text-slate-400 group-hover:text-[#F7941D] transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Year & Title */}
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#005BAA] transition-colors leading-snug">
                        {m.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {m.desc}
                      </p>
                    </div>

                    {/* Bottom Tag */}
                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-500 truncate">
                        {m.highlight}
                      </span>
                      <span className="text-xs font-black text-slate-300 group-hover:text-[#005BAA] transition-colors">
                        {m.year}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
