"use client";

import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageTransition } from "@/components/ui/PageTransition";
import {
  Send,
  ExternalLink,
  Mail,
  Clock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const TARGET_EMAIL = "SetPusbinJFK@bnpb.go.id";
const SUBJECT = "[NASKAH DINAS] Pengajuan Dokumen Resmi ke Pusbin JFK BNPB";

const BODY = `Kepada Yth.
Sekretariat Pusat Pembinaan Jabatan Fungsional BNPB
(SetPusbinJFK@bnpb.go.id)

Dengan hormat,
Bersama ini kami sampaikan naskah dinas kedinasan untuk ditindaklanjuti:

• Nama / NIP           : 
• Jabatan / Unit Kerja  : 
• Instansi Asal         : 
• Nomor Surat Dinas     : 
• Tanggal Surat         : 
• Perihal               : 
• Lampiran Dokumen      : [Nama berkas PDF/Word terlampir]

Keterangan Tambahan:
[Tuliskan catatan jika ada]

Atas perhatian dan kerja samanya, kami ucapkan terima kasih.

Hormat kami,
[Nama Pengirim]
[Nomor Kontak]`;

const GMAIL_LINK = `https://mail.google.com/mail/?view=cm&fs=1&to=${TARGET_EMAIL}&su=${encodeURIComponent(
  SUBJECT
)}&body=${encodeURIComponent(BODY)}`;

export default function PersuratanTerintegrasiPage() {
  return (
    <PageTransition>
      <div className="w-full min-h-[calc(100vh-80px)] bg-[#F8FAFC] flex flex-col">
        <PageHeader
          title="Layanan Persuratan Terintegrasi"
          subtitle="Pusat Pembinaan Jabatan Fungsional Kebencanaan — Badan Nasional Penanggulangan Bencana"
          breadcrumbs={[
            { label: "Layanan" },
            { label: "Persuratan Terintegrasi", href: "/layanan/persuratan-terintegrasi" },
          ]}
        />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 flex flex-col justify-center">
          
          {/* ── CARD UTAMA: PENJELASAN PERSURATAN & SATU BUTTON KIRIM SURAT ── */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#044085] via-[#022d5c] to-[#0f1f3d] text-white p-8 sm:p-14 shadow-2xl shadow-blue-950/25 border border-blue-900/40">
            {/* Background Decorative Glow */}
            <div className="absolute -top-28 -right-28 w-[420px] h-[420px] rounded-full bg-[#F7941D]/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-28 -left-28 w-[380px] h-[380px] rounded-full bg-[#005BAA]/30 blur-3xl pointer-events-none" />

            <div className="relative max-w-3xl mx-auto text-center space-y-7">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#F7941D]/20 text-[#F7941D] border border-[#F7941D]/30 tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                Pintu Resmi Persuratan Kedinasan Pusbin JFK BNPB
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Kirim Persuratan Terintegrasi Pusat pembinaan Jabatan Fungsional Kebencanaan
                </h2>
                <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed max-w-2xl mx-auto">
                  Layanan persuratan terpadu untuk pengajuan surat resmi kedinasan dari instansi pengusul, BPBD daerah, maupun pejabat fungsional kebencanaan kepada Sekretariat Pusat Pembinaan Jabatan Fungsional BNPB.
                </p>
              </div>

              {/* ── SATU BUTTON KIRIM SURAT ── */}
              <div className="pt-2 flex flex-col items-center justify-center space-y-3">
                <a
                  href={GMAIL_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-10 py-4 sm:py-4.5 rounded-2xl bg-gradient-to-r from-[#F7941D] to-[#ffaa47] hover:from-[#e58312] hover:to-[#f59b33] text-[#0f1f3d] font-extrabold text-base sm:text-lg shadow-xl shadow-orange-950/30 hover:shadow-orange-900/40 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <Send className="w-5 h-5 text-[#0f1f3d]" />
                  <span>Kirim Surat</span>
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </a>

                <p className="text-xs text-blue-200/70 max-w-md text-center leading-relaxed">
                  Mengarah langsung ke jendela tulis pesan Gmail dengan template naskah dinas resmi yang telah disiapkan ke <span className="text-white font-mono font-medium">{TARGET_EMAIL}</span>.
                </p>
              </div>

              {/* Quick Info Bar */}
              <div className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-blue-200/70">Alamat Tujuan Resmi</div>
                    <div className="text-xs font-semibold text-white font-mono">{TARGET_EMAIL}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-[#F7941D] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-blue-200/70">Jam Kerja Layanan</div>
                    <div className="text-xs font-semibold text-white">Senin – Jumat, 08.00 – 16.00 WIB</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-blue-200/70">Tata Naskah Kedinasan</div>
                    <div className="text-xs font-semibold text-white">Format PDF / TTE Sah BSrE</div>
                  </div>
                </div>
              </div>

            </div>
          </section>

        </main>
      </div>
    </PageTransition>
  );
}
