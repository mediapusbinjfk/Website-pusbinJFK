import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageTransition } from "@/components/ui/PageTransition";
import { ShieldCheck, Lock, FileText, UserCheck, AlertCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Kebijakan Privasi | Pusat Pembinaan JF BNPB",
  description: "Kebijakan privasi dan pelindungan data pribadi pengguna portal resmi Pusat Pembinaan Jabatan Fungsional BNPB.",
};

export default function KebijakanPrivasiPage() {
  return (
    <PageTransition>
      <div className="w-full bg-[#F8FAFC]">
        <PageHeader
          title="Kebijakan Privasi"
          description="Komitmen kami dalam melindungi data pribadi aparatur dan pengunjung portal resmi sesuai regulasi yang berlaku."
          breadcrumbs={[
            { label: "Beranda", href: "/" },
            { label: "Kebijakan Privasi", href: "/kebijakan-privasi" },
          ]}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8 text-slate-700 leading-relaxed text-sm">
            
            {/* Header statement */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-blue-50/70 border border-blue-100 text-[#005BAA]">
              <ShieldCheck className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-base mb-1">Landasan Pelindungan Data</h3>
                <p className="text-xs leading-relaxed text-slate-600">
                  Pusat Pembinaan Jabatan Fungsional Kebencanaan — Badan Nasional Penanggulangan Bencana berkomitmen penuh untuk menjaga privasi dan kerahasiaan informasi pengguna sesuai dengan amanat Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP).
                </p>
              </div>
            </div>

            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-[#005BAA] flex items-center justify-center text-xs font-bold">1</span>
                Data Pribadi yang Kami Kumpulkan
              </h2>
              <p>
                Saat Anda memanfaatkan layanan di portal ini (seperti Layanan Konsultasi, Persuratan Terintegrasi, atau Unduh Produk Hukum), kami dapat menghimpun data berikut:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-slate-600">
                <li>Identitas pemohon: Nama lengkap, Nomor Induk Pegawai (NIP), dan jabatan.</li>
                <li>Kontak resmi: Nomor telepon/WhatsApp dan alamat surat elektronik (email).</li>
                <li>Informasi kelembagaan: Instansi asal, unit kerja, dan nama Unit Pembina Kepegawaian (Umpeg).</li>
                <li>Data berkas dan substansi: Naskah dinas, dokumen usulan angka kredit, dan catatan konsultasi kedinasan.</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-[#005BAA] flex items-center justify-center text-xs font-bold">2</span>
                Tujuan Penggunaan Informasi
              </h2>
              <p>
                Informasi yang dikumpulkan digunakan secara eksklusif untuk kepentingan kedinasan dan operasional pembinaan SDM kebencanaan, meliputi:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-slate-600">
                <li>Memvalidasi dan memproses pengajuan sesi konsultasi (tatap muka atau Zoom meeting).</li>
                <li>Mengirimkan notifikasi resmi, konfirmasi jadwal, dan tautan pertemuan ke email pemohon.</li>
                <li>Melakukan pencatatan dan disposisi naskah dinas sesuai tata persuratan nasional.</li>
                <li>Menghasilkan rekapitulasi data statistik pembinaan jabatan fungsional untuk perumusan kebijakan.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-[#005BAA] flex items-center justify-center text-xs font-bold">3</span>
                Keamanan dan Penyimpanan Data
              </h2>
              <p>
                Data Anda disimpan di infrastruktur database server terenkripsi dengan protokol keamanan modern:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-slate-600">
                <li>Transmisi data dilindungi enkripsi SSL/TLS (HTTPS).</li>
                <li>Akses administratif dibatasi secara ketat berdasarkan prinsip *Least Privilege* dan diautentikasi dengan token aman.</li>
                <li>Kami tidak pernah menjual, menyewakan, atau memberikan data pribadi Anda kepada pihak ketiga untuk kepentingan komersial.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-[#005BAA] flex items-center justify-center text-xs font-bold">4</span>
                Hak Subjek Data
              </h2>
              <p>
                Sesuai dengan ketentuan perundang-undangan, Anda berhak untuk:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-slate-600">
                <li>Memperoleh konfirmasi mengenai data pribadi Anda yang tersimpan di sistem kami.</li>
                <li>Meminta pembaharuan atau perbaikan terhadap data yang keliru atau tidak akurat.</li>
                <li>Mengajukan permohonan pembatalan jadwal atau penghapusan data pengajuan yang tidak lagi diperlukan.</li>
              </ul>
            </section>

            {/* Section 5: Kontak */}
            <section className="space-y-3 pt-4 border-t border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Hubungi Kami</h2>
              <p className="text-slate-600">
                Apabila Anda memiliki pertanyaan, keberatan, atau ingin menggunakan hak pelindungan data pribadi Anda, silakan hubungi kami melalui:
              </p>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <p><span className="font-bold text-slate-800">Sekretariat Pusbin JFK BNPB</span></p>
                <p>Gedung Graha BNPB Lt. 8, Jl. Pramuka No. 38, Matraman, Jakarta Timur 13120</p>
                <p>Email: <a href="mailto:PusbinJFKebencanaan@bnpb.go.id" className="text-[#005BAA] font-semibold hover:underline">PusbinJFKebencanaan@bnpb.go.id</a></p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </PageTransition>
  );
}

