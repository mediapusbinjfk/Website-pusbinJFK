"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ImageIcon,
  FileText,
  Users,
  Calendar,
  History,
  FolderOpen,
  Settings,
  Tag,
  MessageSquare,
  Cog,
  Activity,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Bell,
  ExternalLink,
  ShieldCheck,
  Clock,
  ChevronLeft
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// ============================================================
// SIDEBAR MENU STRUCTURE
// ============================================================
interface MenuChild {
  label: string;
  href: string;
}

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: MenuChild[];
  badge?: number;
}

interface MenuGroup {
  groupLabel: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    groupLabel: "Utama",
    items: [
      {
        label: "Dashboard",
        icon: <LayoutDashboard className="w-4 h-4" />,
        href: "/admin",
      },
    ],
  },
  {
    groupLabel: "Layanan Konsultasi",
    items: [
      {
        label: "Jadwal Konsultasi",
        icon: <Calendar className="w-4 h-4" />,
        href: "/admin/konsultasi/jadwal",
      },
      {
        label: "Pengajuan Konsultasi",
        icon: <Users className="w-4 h-4" />,
        href: "/admin/konsultasi/pengajuan",
      },
      {
        label: "Monitoring WhatsApp",
        icon: <MessageSquare className="w-4 h-4" />,
        href: "/admin/konsultasi/monitoring-wa",
      },
      {
        label: "Riwayat Konsultasi",
        icon: <History className="w-4 h-4" />,
        href: "/admin/konsultasi/riwayat",
      },
    ],
  },
  {
    groupLabel: "Konten Publikasi",
    items: [
      {
        label: "Dokumentasi Kegiatan",
        icon: <ImageIcon className="w-4 h-4" />,
        href: "/admin/dokumentasi",
      },
      {
        label: "Produk Hukum",
        icon: <FileText className="w-4 h-4" />,
        href: "/admin/produk-hukum",
      },
    ],
  },
  {
    groupLabel: "Tata Usaha & Dokumen",
    items: [
      {
        label: "Surat Dinas",
        icon: <FolderOpen className="w-4 h-4" />,
        href: "/admin/dokumen/surat-dinas",
      },
    ],
  },
  {
    groupLabel: "Konfigurasi & Log",
    items: [
      {
        label: "Kategori",
        icon: <Tag className="w-4 h-4" />,
        href: "/admin/pengaturan/kategori",
      },
      {
        label: "Template WhatsApp",
        icon: <MessageSquare className="w-4 h-4" />,
        href: "/admin/pengaturan/template-wa",
      },
      {
        label: "Pengaturan Sistem",
        icon: <Cog className="w-4 h-4" />,
        href: "/admin/pengaturan/sistem",
      },
      {
        label: "Log Aktivitas",
        icon: <Activity className="w-4 h-4" />,
        href: "/admin/aktivitas",
      },
    ],
  },
];

// ============================================================
// SIDEBAR ITEM
// ============================================================
function SidebarItem({
  item,
  collapsed,
  onClose,
}: {
  item: MenuItem;
  collapsed: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const hasChildren = !!item.children?.length;

  const isActive = item.href
    ? pathname === item.href
    : item.children?.some((c) => pathname.startsWith(c.href));

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group",
            isActive
              ? "text-white bg-white/10 shadow-xs"
              : "text-slate-300 hover:text-white hover:bg-white/5"
          )}
          title={collapsed ? item.label : undefined}
        >
          <span
            className={cn(
              "shrink-0 transition-transform duration-200 group-hover:scale-110",
              isActive ? "text-[#F7941D]" : "text-slate-400 group-hover:text-white"
            )}
          >
            {item.icon}
          </span>
          {!collapsed && (
            <>
              <span className="flex-1 text-left tracking-wide">{item.label}</span>
              {open ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              )}
            </>
          )}
        </button>
        {open && !collapsed && (
          <div className="ml-5 mt-1 space-y-0.5 border-l-2 border-slate-700/60 pl-3">
            {item.children!.map((child) => {
              const isChildActive = pathname === child.href;
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onClose}
                  className={cn(
                    "block px-2.5 py-1.5 rounded-lg text-xs transition-all duration-150",
                    isChildActive
                      ? "text-white font-bold bg-[#005BAA] shadow-xs"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  )}
                >
                  {child.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href!}
      onClick={onClose}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 relative group",
        isActive
          ? "text-white bg-gradient-to-r from-[#005BAA] to-[#044085] shadow-md shadow-blue-900/30"
          : "text-slate-300 hover:text-white hover:bg-white/6"
      )}
      title={collapsed ? item.label : undefined}
    >
      <span
        className={cn(
          "shrink-0 transition-transform duration-200 group-hover:scale-110",
          isActive ? "text-[#F7941D]" : "text-slate-400 group-hover:text-slate-200"
        )}
      >
        {item.icon}
      </span>
      {!collapsed && <span className="tracking-wide flex-1 truncate">{item.label}</span>}
      {item.badge !== undefined && !collapsed && (
        <span className="ml-auto bg-[#F7941D] text-slate-950 text-[10px] font-black rounded-full px-2 py-0.5 min-w-[20px] text-center shadow-xs">
          {item.badge}
        </span>
      )}
      {isActive && (
        <span className="absolute right-0 top-2 bottom-2 w-1 bg-[#F7941D] rounded-l-full" />
      )}
    </Link>
  );
}

// ============================================================
// SIDEBAR COMPONENT
// ============================================================
export function AdminSidebar({
  collapsed,
  onClose,
}: {
  collapsed?: boolean;
  onClose?: () => void;
}) {
  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-[#0A1224] border-r border-slate-800/80 text-white transition-all duration-300 select-none shadow-xl",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800/90 shrink-0 bg-[#070D1B]">
        <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 p-1 flex items-center justify-center shrink-0 shadow-inner">
          <Image
            src="/images/logo-badan-nasional-penanggulangan-bencana.png.png"
            alt="BNPB"
            width={34}
            height={34}
            className="object-contain"
          />
        </div>
        {!collapsed && (
          <div className="overflow-hidden min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black tracking-widest text-[#F7941D] uppercase">
                BNPB
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-blue-500/20 text-blue-300 font-bold border border-blue-400/30">
                ADMIN
              </span>
            </div>
            <div className="text-xs font-extrabold text-white tracking-tight truncate leading-tight mt-0.5">
              Pusat Pembinaan JF
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              Kebencanaan RI
            </div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 custom-scrollbar">
        {menuGroups.map((group, gi) => (
          <div key={gi} className="space-y-1">
            {group.groupLabel && !collapsed && (
              <div className="text-[10px] font-extrabold text-slate-400/80 uppercase tracking-widest px-3 mb-1.5 flex items-center justify-between">
                <span>{group.groupLabel}</span>
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <SidebarItem
                  key={item.label}
                  item={item}
                  collapsed={!!collapsed}
                  onClose={onClose}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-800/90 bg-[#070D1B] shrink-0 space-y-2">
        {!collapsed ? (
          <>
            {/* System Status Indicator */}
            <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300 font-medium">Sistem Operasional</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">v2.4</span>
            </div>

            {/* Public Web Link */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/8 transition-all group"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-[#F7941D] group-hover:translate-x-0.5 transition-transform" />
                <span>Web Publik JF</span>
              </span>
              <span className="text-[10px] text-slate-400">Portal Utama</span>
            </a>
          </>
        ) : (
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Lihat Website Publik"
          >
            <ExternalLink className="w-4 h-4 text-[#F7941D]" />
          </a>
        )}
      </div>
    </aside>
  );
}

// ============================================================
// TOPBAR COMPONENT
// ============================================================
function getBreadcrumbs(pathname: string): { group: string; title: string } {
  const map: Record<string, { group: string; title: string }> = {
    "/admin": { group: "Utama", title: "Dashboard Command Center" },
    "/admin/dokumentasi": { group: "Konten Publikasi", title: "Dokumentasi Kegiatan" },
    "/admin/produk-hukum": { group: "Konten Publikasi", title: "Produk Hukum & Regulasi" },
    "/admin/konsultasi/jadwal": { group: "Layanan Konsultasi", title: "Jadwal Konsultasi" },
    "/admin/konsultasi/pengajuan": { group: "Layanan Konsultasi", title: "Pengajuan Konsultasi" },
    "/admin/konsultasi/monitoring-wa": { group: "Layanan Konsultasi", title: "Monitoring Notifikasi WhatsApp" },
    "/admin/konsultasi/riwayat": { group: "Layanan Konsultasi", title: "Riwayat Konsultasi" },
    "/admin/dokumen/surat-dinas": { group: "Tata Usaha", title: "Surat Dinas & Dokumen" },
    "/admin/pengaturan/kategori": { group: "Pengaturan", title: "Kategori Layanan" },
    "/admin/pengaturan/template-wa": { group: "Pengaturan", title: "Template Pesan WhatsApp" },
    "/admin/pengaturan/sistem": { group: "Pengaturan", title: "Pengaturan Sistem" },
    "/admin/aktivitas": { group: "Sistem", title: "Log Aktivitas Admin" },
  };

  if (map[pathname]) return map[pathname];
  for (const [key, val] of Object.entries(map)) {
    if (pathname.startsWith(key) && key !== "/admin") return val;
  }
  return { group: "Portal Admin", title: "Manajemen JF BNPB" };
}

export function AdminTopbar({ onMenuToggle }: { onMenuToggle: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { group, title } = getBreadcrumbs(pathname);

  // Live WIB clock
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Jakarta",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    router.push("/admin/login");
  };

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/90 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-30 shadow-2xs">
      {/* Left side: Menu toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#005BAA]/20"
          aria-label="Toggle menu"
          title="Buka / Tutup Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <span className="hover:text-slate-600 transition-colors">Admin</span>
            <span>/</span>
            <span className="text-slate-600 font-semibold">{group}</span>
          </div>
          <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight truncate leading-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Right side: Time, Public Link, Bell, Admin Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live Digital Clock WIB */}
        {timeStr && (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-700 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-[#005BAA]" />
            <span>{timeStr} WIB</span>
          </div>
        )}

        {/* Shortcut to public portal */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-blue-300 bg-white hover:bg-blue-50/50 text-xs font-bold text-slate-700 hover:text-[#005BAA] transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#F7941D]" />
          <span>Lihat Website</span>
        </a>

        {/* Notifications */}
        <Link
          href="/admin/aktivitas"
          className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-800"
          title="Notifikasi & Log Aktivitas"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F7941D] rounded-full ring-2 ring-white"></span>
        </Link>

        {/* Admin profile chip */}
        <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#044085] to-[#005BAA] flex items-center justify-center text-white text-xs font-black shadow-xs ring-2 ring-blue-100">
            A
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-extrabold text-slate-900 leading-tight">
              Admin JF BNPB
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Pusat Pembinaan JF
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors ml-0.5"
            title="Keluar dari Portal Admin"
            aria-label="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

// ============================================================
// MAIN ADMIN LAYOUT
// ============================================================
export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden antialiased">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <AdminSidebar collapsed={sidebarCollapsed} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 flex h-full">
            <AdminSidebar
              collapsed={false}
              onClose={() => setMobileSidebarOpen(false)}
            />
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-0 translate-x-full bg-[#0A1224] rounded-r-xl p-2.5 text-slate-400 hover:text-white border border-l-0 border-slate-800"
              aria-label="Tutup Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AdminTopbar
          onMenuToggle={() => {
            if (typeof window !== "undefined" && window.innerWidth >= 1024) {
              setSidebarCollapsed(!sidebarCollapsed);
            } else {
              setMobileSidebarOpen(!mobileSidebarOpen);
            }
          }}
        />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
