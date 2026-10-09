"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Calendar, Clock, MapPin, Video, RefreshCw, CheckCircle, X, Eye,
  Search, Filter, MessageCircle, Share2, Plus, ArrowRight, CheckCircle2,
  CalendarCheck, ExternalLink, AlertCircle, Loader2, UploadCloud
} from "lucide-react";
import Link from "next/link";
import type { ScheduleStatus, MeetingMethod, ConsultationSchedule, Consultation } from "@/types/admin";
import { ConsultationStore } from "@/lib/consultationStore";
import type { GoogleCalendarEvent, SyncSchedulePayload } from "@/lib/googleCalendar";
import { pushAllSchedulesToGoogleCalendar } from "@/lib/googleCalendarClient";

const STATUS_CONFIG: Record<ScheduleStatus, { label: string; className: string }> = {
  aktif: { label: "Aktif / Menunggu", className: "bg-green-100 text-green-700" },
  selesai: { label: "Selesai", className: "bg-slate-100 text-slate-600" },
  dibatalkan: { label: "Dibatalkan", className: "bg-red-100 text-red-500" },
};

interface RescheduleForm {
  newDate: string;
  newStartTime: string;
  newEndTime: string;
  method: MeetingMethod;
  meetingLink: string;
  location: string;
  room: string;
  reason: string;
}

function formatDateTimeWIB(iso: string): { date: string; time: string } {
  try {
    const d = new Date(iso);
    const date = d.toLocaleDateString("id-ID", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
      timeZone: "Asia/Jakarta",
    });
    const time = d.toLocaleTimeString("id-ID", {
      hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta",
    });
    return { date, time };
  } catch {
    return { date: "-", time: "-" };
  }
}

export default function AdminJadwalPage() {
  const [schedules, setSchedules] = useState<ConsultationSchedule[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ScheduleStatus | "semua">("semua");
  const [rescheduleTarget, setRescheduleTarget] = useState<(ConsultationSchedule & { name?: string; institution?: string; whatsapp?: string }) | null>(null);
  const [rescheduleForm, setRescheduleForm] = useState<RescheduleForm>({
    newDate: "", newStartTime: "", newEndTime: "",
    method: "online", meetingLink: "", location: "", room: "", reason: "",
  });
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ── Google Calendar state ──────────────────────────────────────────────────
  const [googleEvents, setGoogleEvents] = useState<GoogleCalendarEvent[]>([]);
  const [gcalLoading, setGcalLoading] = useState(false);
  const [syncingAll, setSyncingAll] = useState(false);
  const [gcalError, setGcalError] = useState<string | null>(null);
  const [showGoogleEvents, setShowGoogleEvents] = useState(true);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const POLL_INTERVAL_MS = 30_000; // auto-refresh setiap 30 detik
  const [activeTab, setActiveTab] = useState<"konsultasi" | "google" | "semua">("semua");

  const loadData = () => {
    const s = ConsultationStore.getSchedules();
    const c = ConsultationStore.getConsultations();
    setSchedules(s);
    setConsultations(c);
  };

  const loadGoogleEvents = useCallback(async () => {
    setGcalLoading(true);
    setGcalError(null);
    try {
      const now = new Date();
      const timeMin = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const timeMax = new Date(now.getFullYear(), now.getMonth() + 3, 0).toISOString();
      const res = await fetch(`/api/calendar?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}`);
      const data = await res.json();
      if (data.success) {
        setGoogleEvents(data.events);
        setLastSynced(new Date());
      } else {
        setGcalError(data.message ?? "Gagal memuat Google Calendar.");
      }
    } catch {
      setGcalError("Tidak dapat terhubung ke Google Calendar. Periksa koneksi internet.");
    } finally {
      setGcalLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    loadGoogleEvents();

    // Auto-polling: tarik data Google Calendar setiap 30 detik
    const interval = setInterval(() => {
      loadGoogleEvents();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval); // cleanup saat halaman ditutup
  }, [loadGoogleEvents]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Join schedules with consultation data
  const enrichedSchedules = schedules.map((s) => {
    const matched = consultations.find((c) => c.id === s.consultationId);
    return {
      ...s,
      name: matched?.name || "Pemohon Terdaftar",
      institution: matched?.institution || "Instansi Terkait",
      whatsapp: matched?.whatsapp || "",
      topic: matched?.topic || "Konsultasi JF BNPB",
    };
  });

  const filteredLocal = enrichedSchedules.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.institution.toLowerCase().includes(search.toLowerCase()) ||
      s.scheduleId.toLowerCase().includes(search.toLowerCase()) ||
      s.consultationId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "semua" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredGoogle = googleEvents.filter((e) =>
    e.summary.toLowerCase().includes(search.toLowerCase()) ||
    (e.description ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (e.location ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleReschedule = async () => {
    if (!rescheduleTarget) return;
    setSaving(true);
    ConsultationStore.reschedule(rescheduleTarget.scheduleId, {
      newDate: rescheduleForm.newDate,
      newStartTime: rescheduleForm.newStartTime,
      newEndTime: rescheduleForm.newEndTime,
      method: rescheduleForm.method,
      meetingLink: rescheduleForm.meetingLink,
      location: rescheduleForm.location,
      room: rescheduleForm.room,
      reason: rescheduleForm.reason,
    });
    setSaving(false);
    setRescheduleTarget(null);
    loadData();
    showToast(`Jadwal ${rescheduleTarget.scheduleId} berhasil di-reschedule & email terkirim ke pemohon!`);
  };

  const handleComplete = (scheduleId: string) => {
    ConsultationStore.completeSchedule(scheduleId);
    loadData();
    showToast(`Jadwal ${scheduleId} telah ditandai Selesai.`);
  };

  const handleCancel = (scheduleId: string) => {
    const reason = prompt("Apakah Anda yakin ingin membatalkan jadwal ini?\nMasukkan alasan pembatalan (opsional):", "Agenda dinas mendesak pemohon");
    if (reason !== null) {
      ConsultationStore.cancelSchedule(scheduleId, reason || undefined);
      loadData();
      showToast(`Jadwal ${scheduleId} dibatalkan & email pemberitahuan telah dikirimkan.`);
    }
  };

  const activeCount = schedules.filter((s) => s.status === "aktif").length;

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Jadwal Konsultasi</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Jadwal konsultasi portal & kegiatan dari Google Calendar terpusat di sini.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Push all to Google Calendar button */}
            <button
              onClick={async () => {
                const enriched = ConsultationStore.getEnrichedSchedules();
                if (enriched.length === 0) {
                  showToast("Tidak ada jadwal konsultasi untuk disinkronkan.");
                  return;
                }
                setSyncingAll(true);
                const payloads: SyncSchedulePayload[] = enriched.map((s) => ({
                  scheduleId: s.scheduleId,
                  consultationId: s.consultationId,
                  name: s.name,
                  institution: s.institution,
                  topic: s.topic,
                  notes: s.notes || s.consultationNotes,
                  date: s.date,
                  startTime: s.startTime,
                  endTime: s.endTime,
                  method: s.method,
                  platform: s.platform,
                  meetingLink: s.meetingLink,
                  location: s.location,
                  room: s.room,
                  status: s.status,
                }));
                const result = await pushAllSchedulesToGoogleCalendar(payloads);
                setSyncingAll(false);
                if (result.success) {
                  showToast("✅ Berhasil! Semua jadwal telah disinkronkan ke Google Calendar.");
                  loadGoogleEvents();
                } else {
                  showToast(`⚠️ ${result.message}`);
                }
              }}
              disabled={syncingAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-[#005BAA] hover:from-blue-700 hover:to-[#004B8C] text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50"
              title="Kirim semua jadwal ke Google Calendar"
            >
              {syncingAll ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <UploadCloud className="w-3.5 h-3.5" />
              )}
              <span>{syncingAll ? "Menyinkronkan..." : "Sinkronkan Semua ke Google"}</span>
            </button>

            <div className="flex flex-col items-end gap-0.5">
              <button
                onClick={loadGoogleEvents}
                disabled={gcalLoading}
                className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-all"
              >
                {gcalLoading
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
                  : <RefreshCw className="w-3.5 h-3.5" />}
                {gcalLoading ? "Menyinkronkan..." : "Tarik Google"}
              </button>
              {lastSynced && (
                <p className="text-[10px] text-slate-400">
                  Auto sync 30s · {lastSynced.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </p>
              )}
            </div>

            <Link
              href="/layanan/konsultasi"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
            >
              <span>Buka Formulir Publik</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Jadwal Aktif</p>
              <p className="text-2xl font-bold text-slate-800">{activeCount}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#005BAA] flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Total Konsultasi</p>
              <p className="text-2xl font-bold text-slate-800">{schedules.length}</p>
            </div>
          </div>
          <div className={`p-5 rounded-2xl border flex items-center gap-4 ${gcalError ? "bg-red-50 border-red-200" : "bg-white border-slate-200"}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${gcalError ? "bg-red-100 text-red-500" : "bg-orange-50 text-orange-500"}`}>
              {gcalLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : gcalError ? <AlertCircle className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Google Calendar</p>
              <p className="text-2xl font-bold text-slate-800">
                {gcalLoading ? "..." : gcalError ? "Error" : googleEvents.length}
              </p>
              {gcalError && <p className="text-[10px] text-red-500 mt-0.5">Gagal terhubung</p>}
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Alur Otomatis</p>
              <p className="text-xs text-slate-600 font-medium mt-0.5">Sinkron real-time dengan Google</p>
            </div>
          </div>
        </div>

        {/* Google Calendar Error Banner */}
        {gcalError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-red-800">Google Calendar Tidak Tersambung</p>
              <p className="text-xs text-red-600 mt-0.5">{gcalError}</p>
            </div>
            <button
              onClick={loadGoogleEvents}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          {(["semua", "konsultasi", "google"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab === "semua" && "Semua"}
              {tab === "konsultasi" && `Konsultasi (${schedules.length})`}
              {tab === "google" && `Google Calendar (${googleEvents.length})`}
            </button>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama, instansi, ID jadwal, atau kegiatan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm transition-all"
              />
            </div>
            {(activeTab === "konsultasi" || activeTab === "semua") && (
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as ScheduleStatus | "semua")}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm bg-white"
                >
                  <option value="semua">Semua Status</option>
                  <option value="aktif">Aktif / Menunggu</option>
                  <option value="selesai">Selesai</option>
                  <option value="dibatalkan">Dibatalkan</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Schedule List */}
        <div className="space-y-4">

          {/* ── Jadwal Konsultasi (Lokal) ── */}
          {(activeTab === "semua" || activeTab === "konsultasi") && (
            <>
              {activeTab === "semua" && (
                <div className="flex items-center gap-2 pt-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#005BAA]" />
                  <h3 className="text-sm font-bold text-slate-700">Jadwal Konsultasi Portal</h3>
                  <span className="text-xs text-slate-400">({filteredLocal.length} jadwal)</span>
                </div>
              )}

              {filteredLocal.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                  <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-slate-800">Tidak ada jadwal konsultasi</h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Jadwal baru dari formulir publik otomatis akan muncul di sini.
                  </p>
                </div>
              ) : (
                filteredLocal.map((s) => {
                  const statusCfg = STATUS_CONFIG[s.status] || STATUS_CONFIG.aktif;
                  const isOnline = s.method === "online";
                  return (
                    <div key={s.scheduleId} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isOnline ? "bg-blue-100 text-[#005BAA]" : "bg-amber-100 text-[#F7941D]"}`}>
                            {isOnline ? <Video className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-xs font-mono font-bold text-[#005BAA]">{s.scheduleId}</span>
                              <span className="text-xs text-slate-300">•</span>
                              <span className="text-xs font-mono text-slate-400">{s.consultationId}</span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${statusCfg.className}`}>
                                {statusCfg.label}
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-slate-900">{s.name}</h4>
                            <p className="text-xs text-slate-500">{s.institution} · <span className="text-slate-600 font-medium">{s.topic}</span></p>
                            <div className="flex flex-wrap gap-y-2 gap-x-5 mt-3.5 pt-3 border-t border-slate-100">
                              <div className="flex items-center gap-1.5 text-xs text-slate-700">
                                <Calendar className="w-4 h-4 text-[#F7941D]" />
                                <span className="font-bold">{s.date}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-slate-700">
                                <Clock className="w-4 h-4 text-[#F7941D]" />
                                <span className="font-semibold">{s.startTime} – {s.endTime} WIB</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-slate-700">
                                {isOnline ? (
                                  <><Video className="w-4 h-4 text-blue-500" /><span>{s.platform || "Zoom Meeting"}</span></>
                                ) : (
                                  <><MapPin className="w-4 h-4 text-amber-500" /><span>{s.location || "Graha BNPB"}, {s.room || "Lt. 8"}</span></>
                                )}
                              </div>
                            </div>
                            {isOnline && s.meetingLink && (
                              <div className="mt-3">
                                <a href={s.meetingLink} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-[#005BAA] hover:bg-blue-100 text-xs font-semibold transition-colors">
                                  <Video className="w-3.5 h-3.5" />
                                  Buka Tautan Zoom: {s.meetingLink}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-row sm:flex-col items-end gap-2 shrink-0">
                          {s.whatsapp && (
                            <a
                              href={`https://wa.me/${s.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Halo Bapak/Ibu ${s.name}, kami mengonfirmasi Jadwal Konsultasi JF BNPB Anda (${s.scheduleId}) pada tanggal ${s.date} pukul ${s.startTime} - ${s.endTime} WIB.`)}`}
                              target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition-all border border-emerald-200"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                              Kirim Notif WA
                            </a>
                          )}
                          {s.status === "aktif" && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setRescheduleTarget(s);
                                  setRescheduleForm({
                                    newDate: s.date, newStartTime: s.startTime, newEndTime: s.endTime,
                                    method: s.method, meetingLink: s.meetingLink || "",
                                    location: s.location || "Gedung Graha BNPB Lt. 8",
                                    room: s.room || "Ruang Rapat Pembinaan JF", reason: "",
                                  });
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#005BAA] text-[#005BAA] hover:bg-blue-50 text-xs font-semibold transition-colors"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                Reschedule
                              </button>
                              <button
                                onClick={() => handleComplete(s.scheduleId)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition-colors"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                Selesai
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}

          {/* ── Jadwal dari Google Calendar ── */}
          {(activeTab === "semua" || activeTab === "google") && (
            <>
              {activeTab === "semua" && (
                <div className="flex items-center gap-2 pt-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                  <h3 className="text-sm font-bold text-slate-700">Kegiatan dari Google Calendar</h3>
                  <span className="text-xs text-slate-400">({filteredGoogle.length} kegiatan)</span>
                  {gcalLoading && <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin" />}
                </div>
              )}

              {gcalLoading ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                  <Loader2 className="w-8 h-8 text-slate-300 mx-auto mb-3 animate-spin" />
                  <p className="text-sm text-slate-500">Memuat data dari Google Calendar...</p>
                </div>
              ) : filteredGoogle.length === 0 && !gcalError ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                  <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-slate-800">Tidak ada kegiatan dari Google Calendar</h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Kegiatan yang ditambahkan langsung di Google Calendar akan muncul di sini.
                  </p>
                </div>
              ) : (
                filteredGoogle.map((ev) => {
                  const start = formatDateTimeWIB(ev.start);
                  const end = formatDateTimeWIB(ev.end);
                  return (
                    <div key={ev.id} className="bg-white rounded-2xl border border-orange-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        {/* Badge Google */}
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                          <Calendar className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-600">
                              <span>Google Calendar</span>
                            </span>
                            {ev.isAllDay && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-600">
                                Seharian
                              </span>
                            )}
                          </div>
                          <h4 className="text-base font-bold text-slate-900">{ev.summary}</h4>
                          {ev.description && (
                            <p className="text-xs text-slate-500 mt-0.5">{ev.description}</p>
                          )}
                          <div className="flex flex-wrap gap-y-2 gap-x-5 mt-3.5 pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-1.5 text-xs text-slate-700">
                              <Calendar className="w-4 h-4 text-orange-400" />
                              <span className="font-bold">{start.date}</span>
                            </div>
                            {!ev.isAllDay && (
                              <div className="flex items-center gap-1.5 text-xs text-slate-700">
                                <Clock className="w-4 h-4 text-orange-400" />
                                <span className="font-semibold">{start.time} – {end.time} WIB</span>
                              </div>
                            )}
                            {ev.location && (
                              <div className="flex items-center gap-1.5 text-xs text-slate-700">
                                <MapPin className="w-4 h-4 text-orange-400" />
                                <span>{ev.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {ev.htmlLink && (
                          <a
                            href={ev.htmlLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 text-xs font-semibold transition-all border border-orange-200 shrink-0"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Buka di Google
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>

        {/* MODAL RESCHEDULE */}
        {rescheduleTarget && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-up">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Reschedule Konsultasi</h3>
                  <p className="text-xs text-slate-500">ID: {rescheduleTarget.scheduleId} · {rescheduleTarget.name}</p>
                </div>
                <button onClick={() => setRescheduleTarget(null)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4 text-sm">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Tanggal Baru</label>
                  <input type="date" value={rescheduleForm.newDate}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, newDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Jam Mulai</label>
                    <input type="time" value={rescheduleForm.newStartTime}
                      onChange={(e) => setRescheduleForm({ ...rescheduleForm, newStartTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Jam Selesai</label>
                    <input type="time" value={rescheduleForm.newEndTime}
                      onChange={(e) => setRescheduleForm({ ...rescheduleForm, newEndTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-sm" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Metode Pertemuan</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setRescheduleForm({ ...rescheduleForm, method: "online" })}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold ${rescheduleForm.method === "online" ? "border-[#005BAA] bg-[#005BAA] text-white" : "border-slate-200 text-slate-700"}`}>
                      Zoom (Online)
                    </button>
                    <button type="button" onClick={() => setRescheduleForm({ ...rescheduleForm, method: "offline", location: "Gedung Graha BNPB Lt. 8", room: "Ruang Rapat Pembinaan JF Kebencanaan Lt. 8" })}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold ${rescheduleForm.method === "offline" ? "border-amber-600 bg-amber-600 text-white" : "border-slate-200 text-slate-700"}`}>
                      Tatap Muka
                    </button>
                  </div>
                </div>
                {rescheduleForm.method === "online" && (
                  <div className="space-y-1 bg-blue-50/60 p-3 rounded-xl border border-blue-100">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-blue-600" />
                      Link Zoom Meeting <span className="text-red-500">*</span>
                    </label>
                    <input type="url" required value={rescheduleForm.meetingLink}
                      onChange={(e) => setRescheduleForm({ ...rescheduleForm, meetingLink: e.target.value })}
                      placeholder="https://zoom.us/j/..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-xs text-blue-600 font-mono bg-white" />
                  </div>
                )}
                {rescheduleForm.method === "offline" && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      Lokasi: Gedung Graha BNPB Lt. 8
                    </div>
                    <p className="text-[11px] text-amber-800">Ruang Rapat Pembinaan JF Kebencanaan Lt. 8, Jl. Pramuka No. 38, Matraman</p>
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Alasan Reschedule</label>
                  <input type="text" value={rescheduleForm.reason}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, reason: e.target.value })}
                    placeholder="Contoh: Penyesuaian jadwal narasumber pembina..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-sm" />
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setRescheduleTarget(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold">
                  Batal
                </button>
                <button type="button" disabled={saving} onClick={handleReschedule}
                  className="px-5 py-2 bg-[#005BAA] hover:bg-[#003F7D] text-white rounded-xl text-xs font-bold">
                  {saving ? "Menyimpan..." : "Konfirmasi Reschedule"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
