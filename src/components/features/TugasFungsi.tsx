"use client";

import React, { useState } from "react";
import { Scale, ArrowRight } from "lucide-react";

/* ── data ─────────────────────────────────────────────────── */

const REGULASI = "PERBAN BNPB No. 11 / 2025";

const TUGAS =
  "Melaksanakan penyusunan dan pelaksanaan kebijakan teknis, pemantauan, evaluasi, dan analisis pelaporan bidang pembinaan jabatan fungsional kebencanaan.";

interface FungsiItem {
  id: number;
  short: string;   // kata kunci — ditampilkan besar
  full: string;    // kalimat lengkap — muncul saat dipilih
}

const FUNGSI: FungsiItem[] = [
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

/* ── component ────────────────────────────────────────────── */

export default function TugasFungsi() {
  const [selected, setSelected] = useState<number>(1);
  const active = FUNGSI.find((f) => f.id === selected)!;

  return (
    <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">

      {/* ── TUGAS — full-width editorial strip ── */}
      <div className="border-b border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] divide-y lg:divide-y-0 lg:divide-x divide-slate-100">

          {/* Left — meta label */}
          <div className="flex flex-col justify-between gap-6 p-8 lg:w-64">
            <div>
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-slate-400 mb-3">
                Tugas Pokok
              </p>
              {/* Accent mark — single horizontal rule, not gradient pill */}
              <div className="w-8 h-[3px] bg-[#005BAA] rounded-full mb-4" />
              <p className="text-xs text-slate-500 leading-relaxed">
                Berdasarkan
                <br />
                <span className="font-semibold text-slate-700">{REGULASI}</span>
              </p>
            </div>

            {/* Regulasi badge — minimal */}
            <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#005BAA] bg-[#EFF6FF] border border-[#BFDBFE] px-2.5 py-1.5 rounded self-start">
              <Scale className="w-3 h-3" />
              Dasar Hukum
            </div>
          </div>

          {/* Right — tugas statement */}
          <div className="p-8 flex items-center">
            <blockquote className="text-slate-800 text-[15px] leading-[1.75] font-medium max-w-2xl">
              {/* First word styled as pull-quote */}
              <span className="text-[#005BAA] font-bold">Melaksanakan</span>{" "}
              penyusunan dan pelaksanaan kebijakan teknis, pemantauan, evaluasi,
              dan analisis pelaporan bidang pembinaan jabatan fungsional
              kebencanaan.
            </blockquote>
          </div>
        </div>
      </div>

      {/* ── FUNGSI — interactive selector ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">

        {/* Left — stacked label list */}
        <div className="border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col">
          {/* header */}
          <div className="px-6 py-5 border-b border-slate-100">
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-slate-400 mb-1">
              Fungsi Organisasi
            </p>
            <div className="w-8 h-[3px] bg-[#F7941D] rounded-full" />
          </div>

          {/* list */}
          <nav aria-label="Fungsi jabatan fungsional">
            {FUNGSI.map((item) => {
              const isActive = item.id === selected;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelected(item.id)}
                  aria-pressed={isActive}
                  className={`
                    w-full text-left flex items-center gap-3 px-6 py-4
                    border-b border-slate-50 last:border-b-0
                    transition-colors duration-150 group
                    ${isActive
                      ? "bg-[#005BAA] text-white"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }
                  `}
                >
                  {/* number — plain tabular digit, no box */}
                  <span className={`
                    text-[11px] tabular-nums font-bold shrink-0 w-5 text-right
                    ${isActive ? "text-white/40" : "text-slate-300"}
                  `}>
                    {item.id}
                  </span>

                  <span className="text-sm font-medium leading-snug flex-1">
                    {item.short}
                  </span>

                  <ArrowRight className={`
                    w-3.5 h-3.5 shrink-0 transition-all duration-150
                    ${isActive ? "opacity-60" : "opacity-0 group-hover:opacity-30"}
                  `} />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right — detail pane */}
        <div className="p-8 lg:p-10 flex flex-col justify-between gap-8 min-h-[320px]">

          {/* Large number + full text */}
          <div>
            {/* Giant number — typographic anchor */}
            <p
              className="text-[80px] lg:text-[120px] font-black leading-none
                         text-slate-100 select-none mb-4 -ml-1"
              aria-hidden
            >
              {String(active.id).padStart(2, "0")}
            </p>

            {/* Keyword headline */}
            <h3 className="text-xl font-bold text-[#005BAA] mb-3 -mt-2">
              {active.short}
            </h3>

            {/* Full description */}
            <p className="text-slate-600 text-sm leading-relaxed max-w-lg">
              {active.full}
            </p>
          </div>

          {/* Progress bar — shows position in list */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-[3px] bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#005BAA] rounded-full transition-all duration-300"
                style={{ width: `${(active.id / FUNGSI.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-slate-400 tabular-nums shrink-0">
              {active.id} / {FUNGSI.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
