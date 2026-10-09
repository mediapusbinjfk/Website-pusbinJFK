import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Users2, Network, User, Briefcase, Shield, FileSpreadsheet, Layers } from "lucide-react";
import { PageTransition } from "@/components/ui/PageTransition";

export const metadata = {
  title: "Struktur Organisasi - Profil | JF BNPB",
  description: "Bagan hierarki dan struktur organisasi unit Jabatan Fungsional BNPB.",
};

export default function StrukturOrganisasiPage() {
  return (
    <PageTransition>
      <div className="w-full">
        <PageHeader
          title="Struktur Organisasi"
          description="Bagan hierarki kelembagaan dan pembagian tugas unit kerja JF BNPB."
          breadcrumbs={[
            { label: "Beranda", href: "/" },
            { label: "Profil" },
            { label: "Struktur Organisasi", href: "/profil/struktur-organisasi" },
          ]}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-8 sm:p-10 border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2.5 text-[#005BAA] font-bold text-xs uppercase tracking-wider mb-8">
              <Network className="w-5 h-5" />
              <span>Bagan Organisasi</span>
            </div>

            {/* Visual Org Chart */}
            <div className="flex flex-col items-center gap-0 max-w-4xl mx-auto">
              {/* Level 0: Kepala BNPB */}
              <div className="w-full max-w-md">
                <div className="bg-[#005BAA] text-white rounded-xl p-5 text-center shadow-lg border border-blue-600/30">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2.5 shadow-inner">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-0.5">Pimpinan Lembaga</div>
                  <div className="text-base font-bold text-white">Kepala BNPB</div>
                  <div className="text-xs text-blue-100 mt-1 font-medium">Letjen TNI (Purn.) Suharyanto, S.Sos., M.M.</div>
                </div>
              </div>

              {/* Connector */}
              <div className="w-0.5 h-7 bg-slate-300"></div>

              {/* Level 1: Kepala Pusat */}
              <div className="w-full max-w-lg">
                <div className="bg-[#003F7D] text-white rounded-xl p-5 text-center shadow-md border border-blue-900/40">
                  <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2.5 shadow-inner">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-blue-200 mb-1">Pimpinan Unit Pembina</div>
                  <div className="text-sm sm:text-base font-bold text-white leading-snug">
                    Kepala Pusat Pembinaan Jabatan Fungsional Kebencanaan
                  </div>
                </div>
              </div>

              {/* Connector */}
              <div className="w-0.5 h-7 bg-slate-300"></div>

              {/* Level 2: Kasubag TU */}
              <div className="w-full max-w-md">
                <div className="bg-amber-500 text-white rounded-xl p-4 text-center shadow-md border border-amber-600/30">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2 shadow-inner">
                    <FileSpreadsheet className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-100 mb-0.5">Subbagian Tata Usaha</div>
                  <div className="text-sm font-bold text-white">
                    Kasubag TU (Kepala Subbagian Tata Usaha)
                  </div>
                  <div className="text-xs text-amber-100 mt-1">Dukungan Administrasi, Kepegawaian &amp; Rumah Tangga</div>
                </div>
              </div>

              {/* Connector */}
              <div className="w-0.5 h-7 bg-slate-300"></div>

              {/* Level 3: Kelompok Jabatan Fungsional / Tim Kerja */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-center hover:shadow-md hover:border-[#005BAA]/30 transition-all duration-200">
                  <div className="w-10 h-10 rounded-full bg-[#005BAA]/10 flex items-center justify-center mx-auto mb-2 text-[#005BAA]">
                    <Users2 className="w-5 h-5" />
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Kelompok Jabatan Fungsional</div>
                  <div className="text-sm font-bold text-slate-800">Penata Penanggulangan Bencana</div>
                  <div className="text-xs text-slate-500 mt-1">Pelaksanaan Teknis Penanggulangan Bencana</div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-center hover:shadow-md hover:border-[#F7941D]/50 transition-all duration-200">
                  <div className="w-10 h-10 rounded-full bg-[#F7941D]/10 flex items-center justify-center mx-auto mb-2 text-[#F7941D]">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Kelompok Jabatan Fungsional</div>
                  <div className="text-sm font-bold text-slate-800">Analis Kebencanaan</div>
                  <div className="text-xs text-slate-500 mt-1">Analisis Kebijakan, Risiko &amp; Mitigasi Kebencanaan</div>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="mt-10 pt-6 border-t border-slate-100 text-center text-xs text-slate-400">
              Struktur Organisasi Pusat Pembinaan Jabatan Fungsional Kebencanaan - Badan Nasional Penanggulangan Bencana
            </div>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
