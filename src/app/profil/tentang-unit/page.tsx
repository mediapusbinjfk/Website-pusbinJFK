"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Building2, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import { PageTransition } from "@/components/ui/PageTransition";

const tentangParagraphs = [
  "Pusat Pembinaan Jabatan Fungsional Kebencanaan merupakan unit organisasi di lingkungan Badan Nasional Penanggulangan Bencana (BNPB) yang mempunyai tugas menyelenggarakan pembinaan dan pengembangan Jabatan Fungsional Kebencanaan sebagai bagian dari penguatan tata kelola dan profesionalisme aparatur di bidang penanggulangan bencana.",
  "Dalam melaksanakan tugasnya, Pusat Pembinaan Jabatan Fungsional Kebencanaan melaksanakan penyiapan kebijakan teknis, perencanaan dan pengembangan Jabatan Fungsional, pengembangan kompetensi, penyelenggaraan sistem informasi dan layanan, penyusunan rekomendasi formasi, serta pemantauan dan evaluasi kinerja Jabatan Fungsional Kebencanaan.",
  "Pelaksanaan tugas dan fungsi tersebut diarahkan untuk mewujudkan tata kelola Jabatan Fungsional Kebencanaan yang profesional, berbasis kompetensi dan kinerja, serta selaras dengan kebutuhan organisasi, guna mendukung efektivitas penyelenggaraan penanggulangan bencana dan pencapaian tujuan strategis BNPB.",
];

const kedudukanParagraphs = [
  "Pusat Pembinaan Jabatan Fungsional Kebencanaan merupakan salah satu unit organisasi di lingkungan Badan Nasional Penanggulangan Bencana (BNPB) yang memiliki peran dalam pembinaan dan pengembangan Jabatan Fungsional Kebencanaan.",
  "Dalam struktur organisasi BNPB, Pusat Pembinaan Jabatan Fungsional Kebencanaan menjalankan fungsi pembinaan yang mendukung pelaksanaan tugas dan pencapaian tujuan organisasi, khususnya dalam pengelolaan Jabatan Fungsional. Pelaksanaan tugasnya mencakup penyusunan kebijakan teknis, pengembangan kompetensi, pengelolaan sistem informasi dan layanan, rekomendasi formasi, penyusunan standar kompetensi dan kualitas kerja, serta pemantauan dan evaluasi kinerja Jabatan Fungsional Kebencanaan.",
  "Kedudukannya menjadi bagian penting dalam memastikan pengelolaan Jabatan Fungsional Kebencanaan berjalan secara terarah, berbasis kompetensi, berorientasi pada kinerja, dan sesuai dengan kebutuhan organisasi BNPB.",
];


const PREVIEW_PARAGRAPHS = 1;

function ExpandableCard({
  icon,
  label,
  title,
  paragraphs,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  paragraphs: string[];
  highlight?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = paragraphs.length > PREVIEW_PARAGRAPHS;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 p-8 flex flex-col h-full">
      <div className="flex items-center gap-2.5 text-[#005BAA] font-bold text-xs uppercase tracking-wider mb-3">
        {icon}
        <span>{label}</span>
      </div>
      <h2 className="text-xl font-extrabold text-slate-900 mb-4">{title}</h2>

      <div className="space-y-3 text-slate-600 text-sm leading-relaxed flex-1">
        {paragraphs.slice(0, PREVIEW_PARAGRAPHS).map((p, i) => (
          <p key={i}>{p}</p>
        ))}

        {/* Expanded extra paragraphs */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? "max-h-[600px] opacity-100 space-y-3" : "max-h-0 opacity-0"
            }`}
        >
          {paragraphs.slice(PREVIEW_PARAGRAPHS).map((p, i) => (
            <p key={i} className="mt-3">
              {p}
            </p>
          ))}
        </div>
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-5 self-start flex items-center gap-1.5 text-xs font-semibold text-[#005BAA] hover:text-[#F7941D] transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              Sembunyikan
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              Lihat Selengkapnya
            </>
          )}
        </button>
      )}
    </div>
  );
}

export default function TentangUnitPage() {
  return (
    <PageTransition>
      <div className="w-full">
        <PageHeader
          title="Tentang Unit"
          description="Profil, kedudukan, dan ruang lingkup Pusat Pembinaan Jabatan Fungsional Kebencanaan."
          breadcrumbs={[
            { label: "Beranda", href: "/" },
            { label: "Profil" },
            { label: "Tentang Unit", href: "/profil/tentang-unit" },
          ]}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">

          {/* Tentang Unit + Kedudukan - side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ExpandableCard
              icon={<Building2 className="w-5 h-5" />}
              label="Gambaran Umum"
              title="Pusat Pembinaan Jabatan Fungsional Kebencanaan"
              paragraphs={tentangParagraphs}
            />
            <ExpandableCard
              icon={<ShieldCheck className="w-5 h-5" />}
              label="Kedudukan"
              title="Kedudukan dalam Organisasi BNPB"
              paragraphs={kedudukanParagraphs}
            />
          </div>


        </div>
      </div>
    </PageTransition>
  );
}
