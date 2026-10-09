"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageTransition } from "@/components/ui/PageTransition";
import { Scale, ArrowRight, CheckCircle2, BookOpen } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────── */

const REGULASI = "PERBAN BNPB No. 11 Tahun 2025";

interface Item {
  id: number;
  short: string;
  full: string;
}

const TUGAS: Item[] = [
  {
    id: 1,
    short: "Penyusunan Kebijakan Teknis",
    full: "Melaksanakan penyusunan kebijakan teknis bidang pembinaan jabatan fungsional kebencanaan sesuai dengan peraturan perundang-undangan yang berlaku.",
  },
  {
    id: 2,
    short: "Pelaksanaan Kebijakan Teknis",
    full: "Melaksanakan kebijakan teknis bidang pembinaan jabatan fungsional kebencanaan secara terencana, terukur, dan akuntabel.",
  },
  {
    id: 3,
    short: "Pemantauan",
    full: "Melaksanakan pemantauan terhadap pelaksanaan kebijakan dan program bidang pembinaan jabatan fungsional kebencanaan di seluruh tingkatan.",
  },
  {
    id: 4,
    short: "Evaluasi",
    full: "Melaksanakan evaluasi secara berkala terhadap efektivitas kebijakan, program, dan kegiatan pembinaan jabatan fungsional kebencanaan.",
  },
  {
    id: 5,
    short: "Analisis & Pelaporan",
    full: "Melaksanakan analisis dan pelaporan hasil pelaksanaan kegiatan bidang pembinaan jabatan fungsional kebencanaan kepada pimpinan.",
  },
];

const FUNGSI: Item[] = [
  {
    id: 1,
    short: "Kebijakan Teknis",
    full: "Penyiapan penyusunan kebijakan teknis bidang pembinaan jabatan fungsional kebencanaan.",
  },
  {
    id: 2,
    short: "Rencana & Anggaran",
    full: "Penyiapan penyusunan rencana, program, dan anggaran pembinaan jabatan fungsional kebencanaan.",
  },
  {
    id: 3,
    short: "Sistem Informasi",
    full: "Penyiapan pelaksanaan pengembangan sistem informasi dan layanan informasi jabatan fungsional kebencanaan.",
  },
  {
    id: 4,
    short: "Rekomendasi Formasi",
    full: "Penyiapan penyusunan pemberian rekomendasi formasi jabatan fungsional kebencanaan.",
  },
  {
    id: 5,
    short: "Pengembangan Kompetensi",
    full: "Penyiapan penyusunan rencana pengembangan kompetensi jabatan fungsional kebencanaan.",
  },
  {
    id: 6,
    short: "Standar Kompetensi",
    full: "Penyusunan standar kompetensi dan kualitas kerja jabatan fungsional kebencanaan.",
  },
  {
    id: 7,
    short: "Pemantauan Kinerja",
    full: "Pelaksanaan pemantauan dan evaluasi kinerja jabatan fungsional kebencanaan.",
  },
  {
    id: 8,
    short: "Evaluasi & Pelaporan",
    full: "Penyiapan pelaksanaan pemantauan, evaluasi, dan analisis pelaporan bidang pembinaan jabatan fungsional kebencanaan.",
  },
];

/* ─────────────────────────────────────────────────────────────────
   SHARED INTERACTIVE PANEL
───────────────────────────────────────────────────────────────── */

function InteractivePanel({
  items,
  accentColor,
  listLabel,
  selected,
  onSelect,
}: {
  items: Item[];
  accentColor: string;
  listLabel: string;
  selected: number;
  onSelect: (id: number) => void;
}) {
  const active = items.find((i) => i.id === selected)!;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

      {/* Left: selector list */}
      <div className="border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col">
        <div className="px-6 py-5 border-b border-slate-100">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-1">
            {listLabel}
          </p>
          <div
            className="w-8 h-[3px] rounded-full"
            style={{ background: accentColor }}
          />
        </div>

        <nav aria-label={`Pilih ${listLabel}`} className="flex-1">
          {items.map((item) => {
            const isActive = item.id === selected;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                aria-pressed={isActive}
                className={`
                  w-full text-left flex items-center gap-3 px-6 py-4
                  border-b border-slate-50 last:border-b-0
                  transition-all duration-150 group
                  ${isActive
                    ? "bg-[#044085] text-white"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
                `}
              >
                <span
                  className={`text-[11px] tabular-nums font-bold shrink-0 w-5 text-right
                    ${isActive ? "text-white/40" : "text-slate-300"}`}
                >
                  {item.id}
                </span>
                <span className="text-sm font-medium leading-snug flex-1">
                  {item.short}
                </span>
                <ArrowRight
                  className={`w-3.5 h-3.5 shrink-0 transition-all duration-150
                    ${isActive ? "opacity-60" : "opacity-0 group-hover:opacity-30"}`}
                />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right: detail pane */}
      <div className="p-10 lg:p-14 flex flex-col justify-between gap-10 min-h-[380px]">
        <div key={selected}>
          {/* Large decorative number */}
          <p
            className="text-[100px] lg:text-[140px] font-black leading-none text-slate-100 select-none -ml-1 mb-2"
            aria-hidden
          >
            {String(active.id).padStart(2, "0")}
          </p>

          {/* Keyword headline */}
          <h2 className="text-2xl font-extrabold text-[#044085] mb-4 -mt-4">
            {active.short}
          </h2>

          {/* Full description */}
          <p className="text-slate-600 text-base leading-relaxed max-w-lg">
            {active.full}
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-[3px] bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${(active.id / items.length) * 100}%`,
                background: accentColor,
              }}
            />
          </div>
          <span className="text-xs text-slate-400 tabular-nums shrink-0">
            {active.id} / {items.length}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────────────────────────── */

export default function TugasFungsiPage() {
  const [activeTab, setActiveTab] = useState<"tugas" | "fungsi">("tugas");
  const [selectedTugas, setSelectedTugas] = useState<number>(1);
  const [selectedFungsi, setSelectedFungsi] = useState<number>(1);

  return (
    <PageTransition>
      <div className="w-full">
        <PageHeader
          title="Tugas & Fungsi"
          description="Tugas pokok dan fungsi organisasi Pusat Pembinaan Jabatan Fungsional Kebencanaan berdasarkan regulasi yang berlaku."
          breadcrumbs={[
            { label: "Beranda", href: "/" },
            { label: "Profil" },
            { label: "Tugas & Fungsi", href: "/profil/tugas-fungsi" },
          ]}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Regulasi badge */}
          <div className="flex items-center gap-2 mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-[#005BAA] text-xs font-bold">
              <Scale className="w-3.5 h-3.5" />
              <span>Berdasarkan {REGULASI}</span>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit mb-10 shadow-inner">
            {(["tugas", "fungsi"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  relative px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200
                  ${activeTab === tab
                    ? "bg-[#044085] text-white shadow-md"
                    : "text-slate-500 hover:text-slate-800"}
                `}
              >
                {tab === "tugas" ? (
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    Tugas Pokok
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Fungsi Organisasi
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* PANEL: TUGAS */}
          {activeTab === "tugas" && (
            <InteractivePanel
              items={TUGAS}
              accentColor="#005BAA"
              listLabel="5 Tugas Pokok"
              selected={selectedTugas}
              onSelect={setSelectedTugas}
            />
          )}

          {/* PANEL: FUNGSI */}
          {activeTab === "fungsi" && (
            <InteractivePanel
              items={FUNGSI}
              accentColor="#F7941D"
              listLabel="8 Fungsi Organisasi"
              selected={selectedFungsi}
              onSelect={setSelectedFungsi}
            />
          )}
        </div>
      </div>
    </PageTransition>
  );
}
