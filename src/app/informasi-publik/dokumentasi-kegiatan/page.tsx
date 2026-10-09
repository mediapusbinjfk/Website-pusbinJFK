"use client";

import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Calendar, MapPin, ArrowRight, Search, X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { PageTransition } from "@/components/ui/PageTransition";
import { useAktivitasStore, type Aktivitas } from "@/lib/aktivitasStore";


export default function DokumentasiKegiatanPage() {
  const { aktivitas } = useAktivitasStore();
  const [selectedActivity, setSelectedActivity] = React.useState<Aktivitas | null>(null);

  return (
    <PageTransition>
      <div className="w-full">
        <PageHeader
          title="Dokumentasi Kegiatan (contoh/on progress)"
          description="Galeri foto dan rekaman aktivitas kegiatan resmi Jabatan Fungsional BNPB. (contoh/on progress)"
          breadcrumbs={[
            { label: "Beranda", href: "/" },
            { label: "Informasi Publik" },
            { label: "Dokumentasi Kegiatan", href: "/informasi-publik/dokumentasi-kegiatan" },
          ]}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Search bar */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari dokumentasi kegiatan..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] transition-all text-sm bg-white"
              />
            </div>
            <p className="text-sm text-slate-500 shrink-0">
              <span className="font-semibold text-slate-800">{aktivitas.length}</span> kegiatan terdokumentasi
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {aktivitas.map((act) => (
              <Card
                key={act.id}
                hoverable
                className="flex flex-col overflow-hidden border border-slate-200 shadow-sm group cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={act.image}
                    alt={act.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#005BAA] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                      {act.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3 bg-white">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#F7941D]" />
                        {formatDate(act.date)}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#005BAA] transition-colors">
                      {act.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="line-clamp-1">{act.location}</span>
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {act.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <button 
                      onClick={() => setSelectedActivity(act)}
                      className="text-sm font-semibold text-[#005BAA] hover:text-[#003F7D] flex items-center gap-2 group/btn transition-colors"
                    >
                      Lihat Detail
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL DETAIL KEGIATAN */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg">Detail Kegiatan</h3>
              <button 
                onClick={() => setSelectedActivity(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto">
              <div className="w-full h-64 sm:h-80 relative bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={selectedActivity.image} 
                  alt={selectedActivity.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#005BAA] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                    {selectedActivity.category}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 leading-snug">
                    {selectedActivity.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-4 h-4 text-[#F7941D]" />
                      {formatDate(selectedActivity.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#F7941D]" />
                      {selectedActivity.location}
                    </span>
                  </div>
                </div>

                <div className="prose prose-sm sm:prose-base max-w-none text-slate-600">
                  <p className="leading-relaxed whitespace-pre-line">
                    {selectedActivity.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
