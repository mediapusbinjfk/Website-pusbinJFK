import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Search, Filter, FileText, Download } from "lucide-react";
import { PageTransition } from "@/components/ui/PageTransition";

export const metadata = {
  title: "Produk Hukum - Layanan | JF BNPB",
  description: "Kumpulan peraturan dan regulasi terkait Jabatan Fungsional BNPB.",
};

const mockLegalProducts = [
  {
    id: 1,
    title: "Peraturan Menteri Pendayagunaan Aparatur Negara Nomor 43 Tahun 2018",
    year: 2018,
    category: "PermenPAN",
    about: "Tentang Jabatan Fungsional Penata Penanggulangan Bencana",
  },
  {
    id: 2,
    title: "Peraturan BNPB Nomor 4 Tahun 2019",
    year: 2019,
    category: "Peraturan Kepala",
    about: "Tentang Petunjuk Pelaksanaan Jabatan Fungsional Penata Penanggulangan Bencana",
  },
  {
    id: 3,
    title: "Peraturan BNPB Nomor 7 Tahun 2021",
    year: 2021,
    category: "Peraturan Kepala",
    about: "Tentang Standar Kompetensi JF Penata Penanggulangan Bencana",
  },
  {
    id: 4,
    title: "Keputusan Kepala BNPB Nomor 12A Tahun 2023",
    year: 2023,
    category: "Keputusan",
    about: "Tentang Penilaian Angka Kredit Jabatan Fungsional PB",
  },
  {
    id: 5,
    title: "Surat Edaran Nomor: SE/01/BNPB/2024",
    year: 2024,
    category: "Surat Edaran",
    about: "Perihal Pembinaan dan Pengembangan Karier JF Penata PB",
  },
];

const categories = ["Semua Kategori", "PermenPAN", "Peraturan Kepala", "Keputusan", "Surat Edaran"];

export default function ProdukHukumPage() {
  return (
    <PageTransition>
      <div className="w-full">
        <PageHeader
          title="Produk Hukum (contoh/on progress)"
          description="Repositori peraturan, perundang-undangan, dan dokumen regulasi resmi terkait Jabatan Fungsional BNPB. (contoh/on progress)"
          breadcrumbs={[
            { label: "Beranda", href: "/" },
            { label: "Layanan" },
            { label: "Produk Hukum", href: "/layanan/produk-hukum" },
          ]}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari peraturan, keputusan, surat edaran..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] transition-all bg-white"
              />
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] text-sm">
                <option>Semua Tahun</option>
                <option>2024</option>
                <option>2023</option>
                <option>2021</option>
                <option>2019</option>
                <option>2018</option>
              </select>
              <button className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 hover:border-slate-300 flex items-center gap-2 transition-all text-sm font-medium">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
              </button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat, idx) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border ${
                  idx === 0
                    ? "bg-[#005BAA] text-white border-[#005BAA]"
                    : "bg-white text-slate-600 border-slate-200 hover:border-[#005BAA] hover:text-[#005BAA]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results */}
          <p className="text-sm text-slate-500 mb-4">Menampilkan <span className="font-semibold text-slate-800">{mockLegalProducts.length}</span> dokumen</p>

          <Card className="border border-slate-200 bg-white overflow-hidden">
            <div className="divide-y divide-slate-100">
              {mockLegalProducts.map((item) => (
                <div
                  key={item.id}
                  className="p-6 hover:bg-slate-50 transition-colors duration-150 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#005BAA] flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 mb-1.5 leading-snug group-hover:text-[#005BAA] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 mb-2">{item.about}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#005BAA] border border-blue-100">{item.category}</span>
                        <span>Tahun {item.year}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 md:ml-auto shrink-0">
                    <button className="flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-[#005BAA] bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-100">
                      Lihat
                    </button>
                    <button className="flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-[#005BAA] hover:bg-[#003F7D] rounded-xl transition-colors gap-2 shadow-sm">
                      <Download className="w-4 h-4" />
                      Unduh
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
