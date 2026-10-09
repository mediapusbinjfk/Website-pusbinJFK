"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Target, Award, Compass } from "lucide-react";
import { unitProfileData } from "@/data/mockProfile";

const PILLARS = [
  {
    id: "tugas",
    title: "Tugas Utama",
    icon: Target,
    desc: "Menyelenggarakan penyiapan kebijakan teknis, pembinaan karir, rekomendasi formasi, dan standardisasi kompetensi aparatur kebencanaan di seluruh Indonesia.",
  },
  {
    id: "peran",
    title: "Peran Strategis",
    icon: Compass,
    desc: "Memastikan ketersediaan pejabat fungsional yang kompeten, responsif, dan adaptif dalam seluruh siklus prabencana, saat darurat, hingga pascabencana.",
  },
  {
    id: "standar",
    title: "Standar & Kualitas",
    icon: Award,
    desc: "Menerapkan kerangka konversi angka kredit dan uji kompetensi berkala sesuai regulasi Kementerian PANRB dan BNPB.",
  },
];

export const AboutPreview: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [activePillar, setActivePillar] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 lg:py-28 overflow-hidden bg-white">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-70 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Logo only */}
          <div
            className="lg:col-span-5 flex flex-col items-center justify-center gap-5"
            style={{
              transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-28px)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-badan-nasional-penanggulangan-bencana.png.png"
              alt="Logo BNPB"
              className="w-48 h-48 sm:w-60 sm:h-60 object-contain drop-shadow-xl"
              style={{ animation: "logoFloat 5s ease-in-out infinite" }}
            />
            <p className="text-base font-bold text-[#044085] leading-snug max-w-[240px] text-center">
              Pusat Pembinaan Jabatan Fungsional Kebencanaan
            </p>
          </div>


          {/* Right Column: Interactive Pillar Architecture */}
          <div
            className="lg:col-span-7 space-y-8"
            style={{
              transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1) 120ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) 120ms",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(28px)",
            }}
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#044085] tracking-tight leading-tight">
                Membangun Ketangguhan SDM Kebencanaan Indonesia
              </h2>
              <p className="mt-4 text-slate-600 text-base leading-relaxed">
                Pusat Pembinaan Jabatan Fungsional Kebencanaan memegang mandat strategis dalam menjamin kompetensi teknis, profesionalitas, dan jenjang karir aparatur penanggulangan bencana di Indonesia.
              </p>
            </div>

            {/* Pillar Selector Tabs */}
            <div className="space-y-3">
              {PILLARS.map((pillar, idx) => {
                const Icon = pillar.icon;
                const isActive = activePillar === idx;
                return (
                  <div
                    key={pillar.id}
                    onClick={() => setActivePillar(idx)}
                    className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${isActive
                        ? "bg-[#EFF6FF] border-[#BFDBFE] shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70"
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isActive
                            ? "bg-[#005BAA] text-white"
                            : "bg-slate-100 text-slate-500"
                          }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-base font-bold ${isActive ? "text-[#005BAA]" : "text-slate-800"}`}>
                            {pillar.title}
                          </h4>
                          {isActive && (
                            <span className="text-[11px] font-bold text-[#F7941D] uppercase tracking-wider">
                              Fokus Utama
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {pillar.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Direct CTA */}
            <div className="pt-2">
              <Link
                href="/profil/tentang-unit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#005BAA] hover:bg-[#004787] text-white font-bold text-sm shadow-md shadow-blue-900/20 transition-all duration-200 active:scale-[0.98]"
              >
                <span>Pelajari Profil & Struktur Lengkap</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};



