"use client";

import React from "react";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const DocumentationPreview: React.FC = () => {
  const [items, setItems] = React.useState<any[]>([]);

  React.useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/dokumentasi");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setItems(
            json.data.map((d: any) => ({
              id: d.id,
              title: d.title,
              category: d.category,
              date: d.date,
              location: d.location,
              description: d.description,
              image: d.thumbnailUrl,
            }))
          );
        }
      } catch (err) {
        console.error("Gagal memuat dokumentasi preview:", err);
      }
    }
    loadData();
  }, []);

  return (
    <section data-reveal="section" className="relative py-20 lg:py-24 bg-white overflow-hidden">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-extrabold text-[#0f1f3d] tracking-tight leading-tight">
              Publikasi & Dokumentasi
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Galeri foto, publikasi resmi, dan dokumentasi kegiatan Jabatan Fungsional BNPB.
            </p>
          </div>

          <Link href="/informasi-publik/dokumentasi-kegiatan" className="shrink-0">
            <div
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-md shadow-blue-900/20 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #005BAA 0%, #003F7D 100%)",
              }}
            >
              <span>Lihat Semua Publikasi</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>

        {/* Cards Grid or Empty State */}
        {items.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-12 text-center max-w-lg mx-auto shadow-sm space-y-3 transition-shadow duration-300 hover:shadow-md">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#005BAA] flex items-center justify-center mx-auto border border-blue-100 transition-transform duration-300 hover:scale-105">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Belum Ada Publikasi</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Publikasi kegiatan resmi Jabatan Fungsional BNPB akan ditampilkan di sini setelah dipublikasikan oleh tim administrator melalui database.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {items.slice(0, 3).map((act) => (
              <Link key={act.id} href="/informasi-publik/dokumentasi-kegiatan" className="group block h-full">
                <div className="relative bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-full">
                  {/* Top gradient edge indicator */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#005BAA] to-[#F7941D] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

                  {/* Image Container */}
                  <div className="relative h-52 w-full bg-slate-100 overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={act.image}
                      alt={act.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                      <span className="group-hover:translate-x-0.5 transition-transform duration-200">Lihat Publikasi</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
