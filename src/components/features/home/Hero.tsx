"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GitBranch, ChevronLeft, ChevronRight, ArrowDown, ShieldCheck } from "lucide-react";
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

  const handleScrollDown = () => {
    const element = document.getElementById("main-services");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
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

        {/* Brand Accent Atmospheric Highlights */}
        <div className="absolute top-1/4 left-10 w-[550px] h-[550px] bg-[#005BAA]/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-[450px] h-[450px] bg-[#F7941D]/12 rounded-full blur-[130px] pointer-events-none" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Authoritative Editorial Copy */}
          <div className="lg:col-span-11 xl:col-span-10 space-y-6">
            


            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl lg:text-[3.6rem] font-extrabold text-white tracking-tight leading-[1.12] max-w-4xl">
                Pusat Pembinaan{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F7941D] to-[#ffa842]">
                  Jabatan Fungsional
                </span>{" "}
                Kebencanaan
              </h1>
              <p className="text-base sm:text-lg text-slate-200/90 max-w-3xl font-semibold tracking-wide leading-relaxed">
                PERBAN No. 11 Tahun 2025
              </p>
            </div>

            {/* Interactive CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/layanan/produk-hukum" className="inline-flex">
                <Button
                  size="lg"
                  className="bg-[#005BAA] hover:bg-[#004787] text-white shadow-xl shadow-blue-950/50 px-7 py-3.5 font-bold rounded-xl active:scale-[0.98] transition-all duration-200"
                  icon={<ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />}
                  iconPosition="right"
                >
                  Produk Hukum & Regulasi (contoh/on progress)
                </Button>
              </Link>

              <Link href="/layanan/konsultasi" className="inline-flex">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white hover:text-[#044085] px-7 py-3.5 font-bold rounded-xl active:scale-[0.98] transition-all duration-200 shadow-md"
                  icon={<GitBranch className="w-4 h-4" />}
                >
                  Layanan Konsultasi
                </Button>
              </Link>
            </div>


            {/* Subtle Carousel Dots */}
            <div className="flex items-center gap-2 pt-6">
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

      {/* Interactive Scroll Down Indicator */}
      <button
        onClick={handleScrollDown}
        aria-label="Scroll ke layanan utama"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-white/70 hover:text-white transition-colors duration-200 cursor-pointer group/scroll"
      >
        <span className="text-[11px] font-semibold uppercase tracking-wider group-hover/scroll:translate-y-0.5 transition-transform duration-200">
          Jelajahi Layanan
        </span>
        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center animate-bounce">
          <ArrowDown className="w-4 h-4 text-[#F7941D]" />
        </div>
      </button>
    </section>
  );
};

