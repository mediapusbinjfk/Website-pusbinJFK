"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, ArrowRight, ExternalLink } from "lucide-react";
import { mockActivities } from "@/data/mockActivities";
import { formatDate } from "@/lib/utils";

export const DocumentationPreview: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const recentActivities = mockActivities.slice(0, 3);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 lg:py-24 overflow-hidden bg-gradient-to-b from-[#F4F7FB] via-white to-[#EEF2F6]">
      {/* Accent glows */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[450px] rounded-full bg-[#005BAA]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[350px] h-[350px] rounded-full bg-[#F7941D]/6 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-6"
          style={{
            transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-extrabold text-[#0f1f3d] tracking-tight leading-tight">
                Dokumentasi Kegiatan
              </h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                (contoh/on progress)
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-2">
              Galeri foto dan rekaman kegiatan resmi Jabatan Fungsional BNPB <span className="text-amber-600 font-medium">(contoh/on progress)</span>
            </p>
          </div>

          <Link href="/informasi-publik/dokumentasi-kegiatan" className="shrink-0">
            <div
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-md shadow-blue-900/20 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #005BAA 0%, #003F7D 100%)",
              }}
            >
              <span>Lihat Semua Dokumentasi</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentActivities.map((act, index) => (
            <Link key={act.id} href="/informasi-publik/dokumentasi-kegiatan" className="group block h-full">
              <div
                className="relative bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-400 hover:-translate-y-2 flex flex-col h-full"
                style={{
                  transition: `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${index * 110}ms, transform 0.35s ease, box-shadow 0.35s ease`,
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(36px)",
                }}
              >
                {/* Top gradient edge indicator */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#005BAA] to-[#F7941D] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

                {/* Image Container */}
                <div className="relative h-52 w-full bg-slate-100 overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={act.image}
                    alt={act.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-[#F7941D]" />
                      <span>{formatDate(act.date)}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#005BAA] transition-colors duration-200">
                      {act.title}
                    </h3>

                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {act.description}
                    </p>
                  </div>

                  {/* Interactive card footer */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#005BAA]">
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">Lihat Dokumentasi</span>
                    <ExternalLink className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};


