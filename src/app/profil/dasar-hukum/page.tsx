import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Scale, FileText } from "lucide-react";
import { unitProfileData } from "@/data/mockProfile";
import { PageTransition } from "@/components/ui/PageTransition";

export const metadata = {
  title: "Dasar Hukum - Profil | JF BNPB",
  description: "Landasan regulasi kelembagaan unit Jabatan Fungsional BNPB.",
};

export default function DasarHukumPage() {
  return (
    <PageTransition>
      <div className="w-full">
        <PageHeader
          title="Dasar Hukum"
          description="Landasan regulasi kelembagaan unit Jabatan Fungsional BNPB."
          breadcrumbs={[
            { label: "Beranda", href: "/" },
            { label: "Profil" },
            { label: "Dasar Hukum", href: "/profil/dasar-hukum" },
          ]}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-8 border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2.5 text-[#005BAA] font-bold text-xs uppercase tracking-wider mb-6">
              <Scale className="w-5 h-5" />
              <span>Regulasi Terkait</span>
            </div>

            <div className="space-y-4">
              {unitProfileData.dasarHukum.map((item) => (
                <div
                  key={item.no}
                  className="p-5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-sm hover:border-[#005BAA]/20 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-[#005BAA] font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                      {item.no}
                    </span>
                    <div>
                      <div className="text-base font-bold text-slate-900 mb-1">
                        {item.title}
                      </div>
                      <div className="text-sm text-slate-600">
                        {item.about}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/layanan/produk-hukum?search=${encodeURIComponent(item.title.split(" tentang ")[0])}`}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-[#005BAA] text-slate-700 hover:text-[#005BAA] text-sm font-semibold rounded-lg transition-all duration-200 shrink-0 whitespace-nowrap"
                  >
                    <FileText className="w-4 h-4" />
                    Lihat Dokumen
                  </Link>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
