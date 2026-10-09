import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import { unitProfileData } from "@/data/mockProfile";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0f1f3d] text-slate-300 mt-auto">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-[#F7941D] via-[#044085] to-[#022d5c]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">

          {/* Col 1: Unit & Contact Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center shrink-0">
                <Image
                  src="/images/logo-badan-nasional-penanggulangan-bencana.png.png"
                  alt="Logo BNPB"
                  width={48}
                  height={48}
                  className="object-contain w-full h-full"
                />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#F7941D]">
                  BADAN NASIONAL PENANGGULANGAN BENCANA
                </div>
                <div className="text-sm font-bold text-white leading-tight mt-0.5">
                  {unitProfileData.unitShortName}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://www.bnpb.go.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800/50 hover:bg-[#F7941D] text-slate-300 hover:text-white rounded-xl border border-slate-700 hover:border-[#F7941D] transition-all duration-300 group"
              >
                <span className="text-sm font-semibold">Kembali ke Website Resmi BNPB</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Col 2: Tentang & Layanan */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-700 pb-2 inline-block">
                Tentang
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/profil/sejarah" className="text-slate-400 hover:text-[#F7941D] transition-colors">
                    Sejarah
                  </Link>
                </li>
                <li>
                  <Link href="/profil/tentang-unit" className="text-slate-400 hover:text-[#F7941D] transition-colors">
                    Tentang Unit
                  </Link>
                </li>
                <li>
                  <Link href="/profil/struktur-organisasi" className="text-slate-400 hover:text-[#F7941D] transition-colors">
                    Struktur Organisasi
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Col 3: Layanan & Informasi Publik */}
          <div className="lg:col-span-3 space-y-8">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-700 pb-2 inline-block">
                Layanan
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/layanan/produk-hukum" className="text-slate-400 hover:text-[#F7941D] transition-colors">
                    Produk Hukum (contoh/on progress)
                  </Link>
                </li>
                <li>
                  <Link href="/layanan/konsultasi" className="text-slate-400 hover:text-[#F7941D] transition-colors">
                    Konsultasi
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://script.google.com/macros/s/AKfycbz129kVvvjvr82HjulfmHsOv6crXkNeuEDoUKRo6jIa2qy8L-f9xtEsnTSEQsClAXI0/exec"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-[#F7941D] transition-colors"
                  >
                    Portal Data JF Kebencanaan
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://srikandi.arsip.go.id/auth/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-[#F7941D] transition-colors"
                  >
                    SRIKANDI
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-700 pb-2 inline-block">
                Informasi Publik
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/informasi-publik/dokumentasi-kegiatan" className="text-slate-400 hover:text-[#F7941D] transition-colors">
                    Dokumentasi Kegiatan (contoh/on progress)
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Col 4: Kontak */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-700 pb-2 inline-block">
              Kontak
            </h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#F7941D] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Gedung Graha BNPB Lt. 8, Jl. Pramuka No. 38, Matraman, Jakarta Timur 13120
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#F7941D] shrink-0" />
                <span>(021) 2982 7793 / 117</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#F7941D] shrink-0 mt-1" />
                <div className="flex flex-col gap-1">
                  <a href="mailto:PusbinJFKebencanaan@bnpb.go.id" className="hover:text-[#F7941D] transition-colors">PusbinJFKebencanaan@bnpb.go.id</a>
                  <a href="mailto:SetPusbinJFK@bnpb.go.id" className="hover:text-[#F7941D] transition-colors">SetPusbinJFK@bnpb.go.id</a>
                </div>
              </li>
            </ul>

            <div className="pt-6">
              <div className="flex flex-wrap gap-2">
                {["Instagram", "YouTube", "Twitter"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="px-3 py-1.5 text-xs rounded-md bg-slate-800 text-slate-300 border border-slate-700 hover:border-[#F7941D] hover:text-[#F7941D] transition-all"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="bg-[#07152a] py-5 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © 2026 {unitProfileData.unitShortName}
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-slate-300 transition-colors">Hak Cipta</Link>
            <Link href="#" className="hover:text-slate-300 transition-colors">Kebijakan Privasi</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
