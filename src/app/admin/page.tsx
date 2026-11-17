"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Calendar,
  CalendarCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  Eye,
  TrendingUp,
  FileText,
  ImageIcon,
  Users,
  Video,
  MapPin,
  CalendarDays,
  Activity,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  MessageSquare,
  ChevronRight,
  Zap,
  Check
} from "lucide-react";
import Link from "next/link";
import { ConsultationStore } from "@/lib/consultationStore";
import type { Consultation, ConsultationSchedule, ConsultationStatus } from "@/types/admin";
import { AdminCalendar } from "@/components/admin/calendar/AdminCalendar";
import {
  DateScheduleModal,
  type EnrichedSchedule,
} from "@/components/admin/calendar/DateScheduleModal";
import { ToastContainer, type ToastItem, type ToastType } from "@/components/ui/Toast";

const STATUS_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  menunggu: {
    label: "Menunggu",
    className: "bg-amber-100 text-amber-900 border border-amber-300 font-bold",
  },
  diproses: {
    label: "Diproses",
    className: "bg-blue-100 text-blue-900 border border-blue-300 font-bold",
  },
  terjadwal: {
    label: "Terjadwal",
    className: "bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold",
  },
  selesai: {
    label: "Selesai",
    className: "bg-slate-100 text-slate-800 border border-slate-300 font-bold",
  },
  dibatalkan: {
    label: "Dibatalkan",
    className: "bg-rose-100 text-rose-900 border border-rose-300 font-bold",
  },
};

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-slate-100 text-slate-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${config.className}`}
    >
      {config.label}
    </span>
  );
}

// ============================================================
// STAT CARD COMPONENT
// ============================================================
function StatCard({
  label,
  value,
  subtitle,
  icon,
  badgeText,
  colorScheme,
  href,
}: {
  label: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  badgeText?: string;
  colorScheme: "emerald" | "blue" | "amber" | "slate";
  href: string;
}) {
  const schemes = {
    emerald: {
      border: "hover:border-emerald-500/50",
      topBar: "bg-emerald-500",
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    blue: {
      border: "hover:border-blue-500/50",
      topBar: "bg-[#005BAA]",
      iconBg: "bg-blue-50 text-[#005BAA] border border-blue-100",
      badge: "bg-blue-50 text-[#005BAA] border-blue-200",
    },
    amber: {
      border: "hover:border-amber-500/50",
      topBar: "bg-[#F7941D]",
      iconBg: "bg-amber-50 text-[#F7941D] border border-amber-100",
      badge: "bg-amber-50 text-amber-800 border-amber-200",
    },
    slate: {
      border: "hover:border-slate-400/50",
      topBar: "bg-slate-500",
      iconBg: "bg-slate-100 text-slate-700 border border-slate-200",
      badge: "bg-slate-100 text-slate-700 border-slate-200",
    },
  };

  const current = schemes[colorScheme];

  return (
    <Link
      href={href}
      className={`bg-white rounded-2xl border border-slate-200/90 p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-200 group relative overflow-hidden ${current.border}`}
    >
      {/* Top accent strip */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${current.topBar}`} />

      <div className="flex items-start justify-between gap-3 mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-2xs ${current.iconBg}`}
        >
          {icon}
        </div>
        {badgeText && (
          <span
            className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${current.badge}`}
          >
            {badgeText}
          </span>
        )}
      </div>

      <div>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest truncate">
          {label}
        </p>
        <p className="text-3xl font-black text-slate-900 tracking-tight mt-0.5">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-500 font-medium mt-1 truncate">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 group-hover:text-[#005BAA] transition-colors">
        <span>Buka Rincian</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

// ============================================================
// DASHBOARD PAGE
// ============================================================
export default function AdminDashboardPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [enrichedSchedules, setEnrichedSchedules] = useState<EnrichedSchedule[]>([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const t = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
  });

  // Toast state
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "success", title?: string, duration = 3500) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastItem = { id, type, title, message, duration };
      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const loadData = useCallback(async () => {
    try {
      const res = await fetch("/api/consultations");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const mapped: Consultation[] = json.data.map((c: any) => ({
          id: c.id,
          createdAt: c.createdAt,
          name: c.name,
          whatsapp: c.whatsapp,
          email: c.email || "-",
          institution: c.institution,
          position: c.position,
          topic: c.topic,
          notes: c.notes || "",
          status: c.status as ConsultationStatus,
          method: c.consultationMethod === "zoom" ? "zoom" : "tatap-muka",
          estimatedDate: c.estimatedDate ? c.estimatedDate.split("T")[0] : "",
          estimatedTime: c.estimatedTime || "",
        }));
        setConsultations(mapped);
        const s = ConsultationStore.getEnrichedSchedules() as EnrichedSchedule[];
        setEnrichedSchedules(s);
        return;
      }
    } catch (err) {
      console.warn("Using local fallback on dashboard:", err);
    }
    const c = ConsultationStore.getConsultations();
    const s = ConsultationStore.getEnrichedSchedules() as EnrichedSchedule[];
    setConsultations(c);
    setEnrichedSchedules(s);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle click on calendar date cell
  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setIsModalOpen(true);
  };

  // Get schedules for selected date
  const selectedDateSchedules = useMemo(() => {
    return enrichedSchedules.filter((s) => s.date === selectedDate);
  }, [enrichedSchedules, selectedDate]);

  // Derived stats
  const pendingConsultations = consultations.filter(
    (c) => c.status === "menunggu" || c.status === "diproses"
  );
  const activeSchedules = enrichedSchedules.filter((s) => s.status === "aktif");
  const completedSchedules = enrichedSchedules.filter((s) => s.status === "selesai");

  // Upcoming schedules (next 4)
  const upcomingSchedules = useMemo(() => {
    return enrichedSchedules
      .filter((s) => s.status === "aktif")
      .slice(0, 4);
  }, [enrichedSchedules]);

  // Real recent activities from consultations
  const recentActivities = useMemo(() => {
    return consultations.slice(0, 4).map((c) => ({
      id: c.id,
      text: `Pengajuan dari ${c.name}`,
      detail: `${c.institution} • ${c.topic}`,
      time: new Date(c.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
  }, [consultations]);

  // Indonesian date string for today
  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Toast Container */}
        <ToastContainer toasts={toasts} onClose={removeToast} />

        {/* ============================================================ */}
        {/* EXECUTIVE COMMAND BANNER */}
        {/* ============================================================ */}
        <div className="rounded-3xl bg-gradient-to-r from-[#044085] via-[#005BAA] to-[#04336B] p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-blue-800">
          {/* Subtle background ambient glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-24 -mt-24" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#F7941D]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-bold text-white">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F7941D]" />
                <span>Command Center Pembinaan JF BNPB</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Selamat Bertugas, Administrator
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
                Hari ini: <span className="font-bold text-white">{todayFormatted}</span>.
                Pantau antrean pengajuan verifikasi pegawai, agenda kalender Google dua arah, dan
                publikasi regulasi kebencanaan.
              </p>
            </div>

            {/* Quick action shortcuts */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => {
                  const t = new Date();
                  const pad = (n: number) => n.toString().padStart(2, "0");
                  setSelectedDate(`${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#005BAA] hover:bg-blue-50 font-extrabold text-xs shadow-md transition-all active:scale-95"
              >
                <Plus className="w-4 h-4 text-[#F7941D]" />
                <span>Agenda Hari Ini</span>
              </button>

              <Link
                href="/admin/konsultasi/pengajuan"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F7941D] hover:bg-[#E08316] text-slate-950 font-extrabold text-xs shadow-md transition-all active:scale-95"
              >
                <span>Verifikasi Pengajuan</span>
                {pendingConsultations.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-slate-950 text-white text-[10px]">
                    {pendingConsultations.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* STATS OVERVIEW GRID */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Jadwal Aktif"
            value={activeSchedules.length}
            subtitle="Sesi siap terlaksana"
            badgeText="Ready"
            icon={<CalendarCheck className="w-6 h-6" />}
            colorScheme="emerald"
            href="/admin/konsultasi/jadwal"
          />
          <StatCard
            label="Total Terjadwal"
            value={enrichedSchedules.length}
            subtitle="Semua sesi di kalender"
            badgeText="Agenda"
            icon={<CalendarDays className="w-6 h-6" />}
            colorScheme="blue"
            href="/admin/konsultasi/jadwal"
          />
          <StatCard
            label="Pengajuan Menunggu"
            value={pendingConsultations.length}
            subtitle="Memerlukan verifikasi"
            badgeText={pendingConsultations.length > 0 ? "Perlu Respon" : "Clear"}
            icon={<Clock className="w-6 h-6" />}
            colorScheme="amber"
            href="/admin/konsultasi/pengajuan"
          />
          <StatCard
            label="Konsultasi Selesai"
            value={completedSchedules.length}
            subtitle="Arsip sesi sukses terlaksana"
            badgeText="Arsip"
            icon={<CheckCircle2 className="w-6 h-6" />}
            colorScheme="slate"
            href="/admin/konsultasi/riwayat"
          />
        </div>

        {/* ============================================================ */}
        {/* CORE: INTERACTIVE MONTHLY CALENDAR */}
        {/* ============================================================ */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#005BAA]" />
              <h2 className="text-lg font-black text-slate-800 tracking-tight">
                Kalender Jadwal Konsultasi Bulanan
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
              Klik tanggal untuk membuka modal interaktif atau membuat sesi baru
            </span>
          </div>

          <AdminCalendar
            schedules={enrichedSchedules}
            onDateClick={handleDateClick}
            selectedDate={selectedDate}
          />
        </div>

        {/* ============================================================ */}
        {/* DUAL WORKSPACE: UPCOMING AGENDAS & PENDING QUEUE */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Left Column (2 Cols): Upcoming Schedules & Pending Queue */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Schedules Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-black text-slate-800">
                    Jadwal Terdekat yang Akan Datang
                  </h3>
                </div>
                <Link
                  href="/admin/konsultasi/jadwal"
                  className="text-xs text-[#005BAA] hover:text-[#044085] font-bold transition-colors inline-flex items-center gap-1"
                >
                  <span>Lihat semua jadwal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {upcomingSchedules.length === 0 ? (
                <div className="p-10 text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2 opacity-80" />
                  <p className="text-sm font-bold text-slate-800">
                    Tidak ada jadwal aktif mendatang saat ini
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Pilih tanggal di kalender atas untuk menambahkan jadwal sesi baru atau verifikasi pengajuan yang masuk.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {upcomingSchedules.map((s) => {
                    const isOnline = s.method === "online";

                    return (
                      <div
                        key={s.scheduleId}
                        className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-blue-50/30 transition-colors"
                      >
                        <div className="flex items-start gap-3.5 min-w-0">
                          {/* Method Icon Avatar */}
                          <div
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
                              isOnline
                                ? "bg-purple-50 text-purple-600 border border-purple-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {isOnline ? (
                              <Video className="w-5 h-5" />
                            ) : (
                              <MapPin className="w-5 h-5" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[11px] font-mono font-bold text-[#005BAA] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                                {s.scheduleId}
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="text-xs font-bold text-slate-700">
                                {s.date}
                              </span>
                              <span className="text-xs text-slate-500 font-mono font-medium">
                                ({s.startTime} WIB)
                              </span>
                            </div>

                            <p className="text-sm font-extrabold text-slate-900 truncate">
                              {s.name}
                            </p>
                            <p className="text-xs text-slate-500 truncate mt-0.5">
                              <span className="font-semibold text-slate-700">
                                {s.institution}
                              </span>{" "}
                              · {s.topic}
                            </p>
                          </div>
                        </div>

                        {/* Action: Open modal for this schedule date */}
                        <button
                          onClick={() => handleDateClick(s.date)}
                          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#005BAA] text-xs font-bold shrink-0 transition-colors shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Buka Tanggal</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Antrean Pengajuan Menunggu */}
            {pendingConsultations.length > 0 && (
              <div className="bg-white rounded-2xl border border-amber-200/90 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-amber-200/80 bg-amber-50/60">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-700" />
                    <h3 className="text-sm font-black text-amber-950">
                      Pengajuan Menunggu Penjadwalan ({pendingConsultations.length})
                    </h3>
                  </div>
                  <Link
                    href="/admin/konsultasi/pengajuan"
                    className="text-xs text-amber-900 hover:text-amber-950 font-bold transition-colors inline-flex items-center gap-1"
                  >
                    <span>Buka Semua Antrean</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="divide-y divide-amber-100/60">
                  {pendingConsultations.slice(0, 3).map((c, idx) => (
                    <div
                      key={`${c.id}-${idx}`}
                      className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-amber-50/40 transition-colors text-xs"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-slate-500 font-bold text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200">
                            {c.id}
                          </span>
                          <StatusBadge status={c.status} />
                          {c.estimatedDate && (
                            <span className="text-[11px] text-slate-600 font-medium">
                              Permintaan: {c.estimatedDate}
                            </span>
                          )}
                        </div>
                        <p className="font-black text-slate-900 text-sm truncate">
                          {c.name}
                        </p>
                        <p className="text-slate-500 truncate mt-0.5">
                          {c.institution} · <span className="text-slate-700 font-medium">{c.topic}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          if (c.estimatedDate) {
                            setSelectedDate(c.estimatedDate);
                          }
                          setIsModalOpen(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shrink-0 transition-colors shadow-2xs"
                      >
                        Jadwalkan Sesi
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (1 Col): Quick Modules & Operational Pulse */}
          <div className="space-y-6">
            {/* Quick Content shortcuts */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Akses Cepat Modul
                </h3>
                <span className="text-[10px] text-slate-400 font-semibold">JF BNPB</span>
              </div>

              <div className="space-y-2">
                <Link
                  href="/admin/dokumentasi"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-800">
                        Publikasi
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Galeri foto & liputan berita
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#005BAA] transition-colors" />
                </Link>

                <Link
                  href="/admin/produk-hukum"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-800">
                        Produk Hukum & Regulasi
                      </p>
                      <p className="text-[11px] text-slate-400">
                        PERBAN, SE, & Pedoman
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#005BAA] transition-colors" />
                </Link>

                <Link
                  href="/admin/konsultasi/monitoring-wa"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-800">
                        Monitoring WhatsApp
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Notifikasi otomatis pegawai
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                </Link>

              </div>
            </div>

            {/* Diagnostic Gateway Pulse */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Status Integrasi Layanan
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-orange-500" />
                    <span className="font-bold text-slate-700">Google Calendar</span>
                  </div>
                  <span className="inline-flex items-center gap-1 font-extrabold text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <Check className="w-3 h-3" /> Terhubung
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-bold text-slate-700">WhatsApp Gateway</span>
                  </div>
                  <span className="inline-flex items-center gap-1 font-extrabold text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <Check className="w-3 h-3" /> Siap Kirim
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-bold text-slate-700">Database Supabase (PostgreSQL)</span>
                  </div>
                  <span className="inline-flex items-center gap-1 font-extrabold text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <Check className="w-3 h-3" /> Terkoneksi
                  </span>
                </div>
              </div>
            </div>

            {/* Aktivitas Sistem */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#005BAA]" />
                  <h3 className="text-sm font-black text-slate-800">
                    Aktivitas Sistem
                  </h3>
                </div>
                <Link
                  href="/admin/aktivitas"
                  className="text-xs text-[#005BAA] hover:text-[#044085] font-bold"
                >
                  Buka Log →
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {recentActivities.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs space-y-1">
                    <p className="font-semibold text-slate-600">Belum ada pengajuan konsultasi</p>
                    <p className="text-slate-400">Pengajuan konsultasi dari pemohon akan tercatat otomatis di sini.</p>
                  </div>
                ) : (
                  recentActivities.map((a) => (
                    <div
                      key={a.id}
                      className="p-4 hover:bg-slate-50/60 transition-colors flex items-start gap-3"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#005BAA] flex items-center justify-center shrink-0 mt-0.5">
                        <CalendarCheck className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800 leading-tight">
                          {a.text}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">
                          {a.detail}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 font-mono">
                          {a.time}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Date Schedule Modal */}
        <DateScheduleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedDate={selectedDate}
          schedules={selectedDateSchedules}
        />
      </div>
    </AdminLayout>
  );
}
