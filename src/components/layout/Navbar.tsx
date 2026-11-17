"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SmoothLink } from "@/components/ui/SmoothLink";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { unitProfileData } from "@/data/mockProfile";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenDropdown(null);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = [
    { label: "Beranda", href: "/" },
    {
      label: "Profil",
      href: "/profil/sejarah",
      children: [
        { label: "Sejarah", href: "/profil/sejarah", desc: "Sejarah pembentukan institusi" },
        { label: "Tentang Unit", href: "/profil/tentang-unit", desc: "Informasi umum & kedudukan" },
        { label: "Tugas & Fungsi", href: "/profil/tugas-fungsi", desc: "Tugas pokok & fungsi organisasi" },
        { label: "Struktur Organisasi", href: "/profil/struktur-organisasi", desc: "Bagan hierarki kelembagaan" },
        { label: "Dasar Hukum", href: "/profil/dasar-hukum", desc: "Landasan regulasi kelembagaan" },
      ],
    },
    {
      label: "Layanan",
      href: "/layanan/konsultasi",
      children: [
        { label: "Konsultasi", href: "/layanan/konsultasi", desc: "Layanan tanya jawab" },
        { label: "Persuratan Terintegrasi", href: "/layanan/persuratan-terintegrasi", desc: "Naskah dinas & disposisi digital" },
        { label: "SIUKOM", href: "https://siukom.bnpb.go.id/", desc: "Sistem Informasi Uji Kompetensi" },
        {
          label: "Portal Data JF Kebencanaan",
          href: "https://script.google.com/macros/s/AKfycbz129kVvvjvr82HjulfmHsOv6crXkNeuEDoUKRo6jIa2qy8L-f9xtEsnTSEQsClAXI0/exec",
          desc: "Portal Data Jabatan Fungsional Kebencanaan"
        },
      ],
    },
    {
      label: "Informasi Publik",
      href: "/layanan/produk-hukum",
      children: [
        { label: "Produk Hukum", href: "/layanan/produk-hukum", desc: "Peraturan & Ketentuan resmi" },
        { label: "Publikasi", href: "/informasi-publik/dokumentasi-kegiatan", desc: "Galeri & liputan acara resmi" },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isHome = pathname === "/";
  const isTransparent = isHome && !scrolled;

  const toggleMobileSubmenu = (label: string, e: React.MouseEvent) => {
    e.preventDefault();
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 transition-all duration-300"
      style={{ viewTransitionName: "site-header" }}
    >
      {/* Force rebuild comment */}
      {/* TOP IDENTITY BAR */}
      <div
        className={cn(
          "text-xs py-2 px-4 sm:px-8 hidden md:block transition-all duration-300",
          isTransparent
            ? "bg-transparent text-white/90"
            : "bg-gradient-to-r from-[#044085] to-[#022d5c] text-white"
        )}
      >
        <div className="max-w-7xl mx-auto flex justify-end items-center">
          <div className={cn("flex items-center gap-5", isTransparent ? "text-white/80" : "text-blue-100")}>
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default">
              <Phone className="w-3 h-3 text-[#F7941D]" />
              <span>085111380175</span>
            </span>
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default">
              <Mail className="w-3 h-3 text-[#F7941D]" />
              <span>PusbinJFKebencanaan@bnpb.go.id</span>
            </span>
            <span className={cn(isTransparent ? "text-white/30" : "text-blue-200/60")}>|</span>
            <span className={cn("text-[11px]", isTransparent ? "text-white/80" : "text-blue-200")}>
              Senin - Jumat: 08.00 - 16.00 WIB
            </span>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav
        className={cn(
          "transition-all duration-300",
          isTransparent
            ? "bg-black/10 backdrop-blur-sm"
            : "bg-white/97 backdrop-blur-md shadow-[0_4px_24px_-4px_rgba(4,64,133,0.10)]"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={cn(
            "flex items-center justify-between transition-all duration-300",
            scrolled ? "h-16 lg:h-[68px]" : "h-20 lg:h-[80px]"
          )}>

            {/* LOGO & BRAND */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo-badan-nasional-penanggulangan-bencana.png.png"
                  alt="Logo Badan Nasional Penanggulangan Bencana"
                  className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col">
                <span className={cn("text-[10px] sm:text-[11px] font-bold tracking-[0.12em] uppercase", isTransparent ? "text-blue-300" : "text-[#005BAA]")}>
                  BADAN NASIONAL PENANGGULANGAN BENCANA
                </span>
                <span className={cn("text-sm sm:text-[15px] font-bold leading-tight", isTransparent ? "text-white" : "text-slate-900")}>
                  {unitProfileData.unitShortName}
                </span>
              </div>
            </Link>

            {/* DESKTOP NAVIGATION */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                const hasDropdown = !!link.children;

                return (
                  <div
                    key={link.label}
                    className="relative group"
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 text-[13px] font-semibold rounded-md transition-all duration-200",
                        active
                          ? isTransparent ? "text-[#F7941D]" : "text-[#F7941D] bg-orange-50"
                          : isTransparent ? "text-slate-200 hover:text-white" : "text-slate-700 hover:text-[#F7941D] hover:bg-slate-50"
                      )}
                    >
                      <span>{link.label}</span>
                      {hasDropdown && (
                        <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
                      )}
                    </Link>

                    {/* Active indicator line */}
                    {active && (
                      <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#F7941D] rounded-full" />
                    )}

                    {/* DROPDOWN */}
                    {hasDropdown && (
                      <div className="absolute left-0 top-full pt-4 w-64 transition-all duration-200 origin-top opacity-0 scale-y-95 pointer-events-none group-hover:opacity-100 group-hover:scale-y-100 group-hover:pointer-events-auto">
                        <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-2 space-y-0.5">
                          {link.children?.map((sub) => {
                            const isExternal = sub.href.startsWith("http");
                            return (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                target={isExternal ? "_blank" : undefined}
                                rel={isExternal ? "noopener noreferrer" : undefined}
                                className="block p-3 rounded-lg hover:bg-slate-50 transition-colors duration-150 group/sub"
                              >
                                <div className="text-sm font-semibold text-slate-800 group-hover/sub:text-[#005BAA] transition-colors duration-150">
                                  {sub.label}
                                </div>
                                {sub.desc && (
                                  <div className="text-[11px] text-slate-500 mt-0.5">
                                    {sub.desc}
                                  </div>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                  "p-2 rounded-lg lg:hidden focus:outline-none transition-colors",
                  isTransparent ? "text-white hover:bg-white/10" : "text-slate-700 hover:bg-slate-100"
                )}
                aria-label="Menu Navigasi"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute top-0 left-0 bottom-0 w-[300px] bg-white shadow-2xl animate-slide-in-left overflow-y-auto flex flex-col">

            {/* DRAWER HEADER */}
            <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-[#044085] to-[#022d5c]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/logo-badan-nasional-penanggulangan-bencana.png.png"
                    alt="Logo BNPB"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">
                    BNPB
                  </div>
                  <div className="text-sm font-bold text-white leading-tight">
                    Portal JF BNPB
                  </div>
                </div>
              </div>
            </div>

            {/* MOBILE LINKS (ACCORDION) */}
            <div className="flex-1 py-4 px-3 overflow-y-auto">
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const hasDropdown = !!link.children;
                  const active = isActive(link.href);
                  const isExpanded = openDropdown === link.label;

                  return (
                    <div key={link.label} className="border-b border-slate-100 last:border-0 pb-1 mb-1">
                      {hasDropdown ? (
                        <div>
                          <button
                            onClick={(e) => toggleMobileSubmenu(link.label, e)}
                            className={cn(
                              "w-full flex items-center justify-between p-3 rounded-lg text-sm font-bold transition-colors",
                              active ? "text-[#005BAA] bg-blue-50" : "text-slate-800 hover:bg-slate-50"
                            )}
                          >
                            <span>{link.label}</span>
                            <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isExpanded ? "rotate-180 text-[#005BAA]" : "text-slate-400")} />
                          </button>

                          {/* Submenu accordion */}
                          <div className={cn(
                            "overflow-hidden transition-all duration-300 ease-in-out",
                            isExpanded ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
                          )}>
                            <div className="pl-4 pr-2 py-2 border-l-2 border-slate-100 ml-4 space-y-1">
                              {link.children?.map(sub => {
                                const isExternal = sub.href.startsWith("http");
                                return (
                                  <Link
                                    key={sub.label}
                                    href={sub.href}
                                    target={isExternal ? "_blank" : undefined}
                                    rel={isExternal ? "noopener noreferrer" : undefined}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                      "block py-2.5 px-3 rounded-lg text-sm font-medium transition-colors",
                                      pathname === sub.href ? "text-[#005BAA] bg-blue-50/50" : "text-slate-600 hover:text-[#005BAA] hover:bg-slate-50"
                                    )}
                                  >
                                    {sub.label}
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "block p-3 rounded-lg text-sm font-bold transition-colors",
                            active ? "text-[#005BAA] bg-blue-50" : "text-slate-800 hover:bg-slate-50"
                          )}
                        >
                          {link.label}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* MOBILE DRAWER FOOTER */}
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                <Phone className="w-3.5 h-3.5 text-[#F7941D]" />
                <span>085111380175</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <Mail className="w-3.5 h-3.5 text-[#F7941D]" />
                <span>PusbinJFKebencanaan@bnpb.go.id</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
