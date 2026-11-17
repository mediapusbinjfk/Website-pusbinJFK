"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { unitProfileData } from "@/data/mockProfile";
import { cn } from "@/lib/utils";

const heroImages = [
  {
    src: "/images/hero-bnpb.png",
    caption: "Gedung Graha BNPB Jakarta Pusat",
    tag: "Pusat Koordinasi",
  },
  {
    src: "/images/beranda2.png.png",
    caption: "Pembinaan Jabatan Fungsional Kebencanaan",
    tag: "Kompetensi SDM",
  },
  {
    src: "/images/Beranda3.png",
    caption: "Uji Kompetensi & Sertifikasi Aparatur PB",
    tag: "Standarisasi Nasional",
  },
  {
    src: "/images/beranda4.png",
    caption: "Sinergi Penanggulangan Bencana Seluruh Indonesia",
    tag: "Integritas Kebencanaan",
  },
];

export const Hero: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  };

  return (
    <section className="relative text-white overflow-hidden min-h-[100dvh] flex flex-col justify-between group pt-20">
      {/* Background Images with smooth scale + crossfade */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {heroImages.map((item, idx) => (
          <div
            key={item.src}
            className={cn(
              "absolute inset-0 transition-all duration-[1400ms] ease-out origin-center",
              idx === currentIndex ? "opacity-100 scale-105" : "opacity-0 scale-100 pointer-events-none"
            )}
          >
            <Image
              src={item.src}
              alt={item.caption}
              fill
              priority={idx === 0}
              className="object-cover object-center"
              sizes="100vw"
              quality={90}
            />
          </div>
        ))}

        {/* Master Darkened Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#02142e]/95 via-[#021838]/85 to-[#042854]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#02142e] via-transparent to-black/40" />

        {/* Bottom fade: smooth transition into the section below */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/[0.06] to-transparent pointer-events-none" />

        {/* Brand Accent Atmospheric Highlights */}
        <div className="absolute top-1/4 left-10 w-[550px] h-[550px] bg-[#005BAA]/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-[450px] h-[450px] bg-[#F7941D]/10 rounded-full blur-[130px] pointer-events-none" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Authoritative Editorial Copy */}
          <div className="lg:col-span-11 xl:col-span-10 space-y-6">
            


            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="hero-enter delay-100 text-3xl sm:text-5xl lg:text-[3.6rem] font-extrabold text-white tracking-tight leading-[1.12] max-w-4xl">
                Pusat Pembinaan{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F7941D] to-[#ffa842]">
                  Jabatan Fungsional
                </span>{" "}
                Kebencanaan
              </h1>
              <p className="hero-enter delay-200 text-base sm:text-lg text-slate-200/90 max-w-3xl font-medium tracking-normal leading-relaxed">
                Portal resmi pembinaan karir, regulasi, dan standardisasi aparatur penanggulangan bencana di Indonesia (PERBAN No. 11 Tahun 2025).
              </p>
            </div>

            {/* Interactive CTA Buttons */}
            <div className="hero-enter delay-300 flex flex-wrap items-center gap-4 pt-2">
              <Link href="/layanan/produk-hukum" className="inline-flex group">
                <Button
                  size="lg"
                  className="bg-[#005BAA] hover:bg-[#004787] text-white shadow-xl shadow-blue-950/50 px-7 py-3.5 font-bold rounded-xl active:scale-[0.98] transition-all duration-200 hover:shadow-2xl hover:shadow-blue-950/60 hover:-translate-y-0.5"
                  icon={<ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />}
                  iconPosition="right"
                >
                  Produk Hukum & Regulasi
                </Button>
              </Link>

              <Link href="/layanan/konsultasi" className="inline-flex group">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white hover:text-[#044085] px-7 py-3.5 font-bold rounded-xl active:scale-[0.98] transition-all duration-200 shadow-md hover:-translate-y-0.5"
                  icon={<GitBranch className="w-4 h-4" />}
                >
                  Layanan Konsultasi
                </Button>
              </Link>
            </div>

            {/* Subtle Carousel Dots */}
            <div className="hero-enter delay-400 flex items-center gap-2 pt-6">
              {heroImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(idx);
                  }}
                  aria-label={`Slide ${idx + 1}`}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300 cursor-pointer",
                    idx === currentIndex
                      ? "w-8 bg-[#F7941D]"
                      : "w-2.5 bg-white/30 hover:bg-white/60"
                  )}
                />
              ))}
            </div>


          </div>

        </div>
      </div>
    </section>
  );
};

