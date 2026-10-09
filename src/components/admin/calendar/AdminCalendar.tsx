"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Video,
  MapPin,
  Filter,
  CalendarDays,
  RefreshCw,
  Loader2,
  UploadCloud,
  CheckCircle2,
  Plus,
  Info
} from "lucide-react";
import type { ScheduleStatus } from "@/types/admin";
import type { EnrichedSchedule } from "./DateScheduleModal";
import type { GoogleCalendarEvent, SyncSchedulePayload } from "@/lib/googleCalendar";
import { pushAllSchedulesToGoogleCalendar } from "@/lib/googleCalendarClient";
import { DateScheduleModal } from "./DateScheduleModal";

interface AdminCalendarProps {
  schedules: EnrichedSchedule[];
  onDateClick?: (dateStr: string) => void;
  selectedDate?: string | null;
}

const MONTH_NAMES_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const WEEKDAY_NAMES_ID = [
  { full: "Senin", short: "Sen" },
  { full: "Selasa", short: "Sel" },
  { full: "Rabu", short: "Rab" },
  { full: "Kamis", short: "Kam" },
  { full: "Jumat", short: "Jum" },
  { full: "Sabtu", short: "Sab", isWeekend: true },
  { full: "Minggu", short: "Min", isWeekend: true },
];

function isoToDateStr(iso: string): string {
  try {
    const d = new Date(iso);
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  } catch {
    return iso.split("T")[0] || iso;
  }
}

function isoToTimeStr(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    });
  } catch {
    return "";
  }
}

export function AdminCalendar({
  schedules,
  onDateClick: externalDateClick,
  selectedDate: externalSelectedDate,
}: AdminCalendarProps) {
  // Navigation state
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    if (externalSelectedDate) {
      const [y, m, d] = externalSelectedDate.split("-").map(Number);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) return new Date(y, m - 1, d);
    }
    return new Date();
  });

  const [statusFilter, setStatusFilter] = useState<ScheduleStatus | "semua">("semua");

  // ── Google Calendar state ───────────────────────────────────────────────────
  const [googleEvents, setGoogleEvents] = useState<GoogleCalendarEvent[]>([]);
  const [gcalLoading, setGcalLoading] = useState(false);
  const [syncingAll, setSyncingAll] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Internal modal state if no external onDateClick handler provided
  const [internalSelectedDate, setInternalSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeSelectedDate = externalSelectedDate ?? internalSelectedDate;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Today helper
  const todayStr = useMemo(() => {
    const t = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // ── Fetch Google Calendar ───────────────────────────────────────────────────
  const loadGoogleEvents = useCallback(async () => {
    setGcalLoading(true);
    try {
      const timeMin = new Date(year, month - 1, 1).toISOString();
      const timeMax = new Date(year, month + 4, 0).toISOString();
      const res = await fetch(
        `/api/calendar?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}`
      );
      const data = await res.json();
      if (data.success) {
        setGoogleEvents(data.events || []);
        setLastSynced(new Date());
      }
    } catch {
      // Gagal sync
    } finally {
      setGcalLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    loadGoogleEvents();
    const interval = setInterval(loadGoogleEvents, 30_000); // auto-refresh 30 detik
    return () => clearInterval(interval);
  }, [loadGoogleEvents]);

  // ── Sync All Local Schedules to Google Calendar ─────────────────────────────
  const handlePushAllToGoogle = async () => {
    if (schedules.length === 0) {
      showToast("Tidak ada jadwal konsultasi yang tersimpan untuk disinkronkan.");
      return;
    }

    setSyncingAll(true);
    const payloads: SyncSchedulePayload[] = schedules.map((s) => ({
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
  };

  // ── Consultation schedules map: date → EnrichedSchedule[] ─────────────────
  const schedulesByDate = useMemo(() => {
    const map: Record<string, EnrichedSchedule[]> = {};
    for (const s of schedules) {
      if (statusFilter !== "semua" && s.status !== statusFilter) continue;
      if (!map[s.date]) map[s.date] = [];
      map[s.date].push(s);
    }
    return map;
  }, [schedules, statusFilter]);

  // ── Google events map: date → GoogleCalendarEvent[] ───────────────────────
  const googleByDate = useMemo(() => {
    const map: Record<string, GoogleCalendarEvent[]> = {};
    for (const ev of googleEvents) {
      const dateStr = isoToDateStr(ev.start);
      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(ev);
    }
    return map;
  }, [googleEvents]);

  // Handle cell click
  const handleCellClick = (dateStr: string) => {
    setInternalSelectedDate(dateStr);
    setIsModalOpen(true);
    if (externalDateClick) {
      externalDateClick(dateStr);
    }
  };

  // ── Navigation ──────────────────────────────────────────────────────────────
  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleToday = () => {
    const t = new Date();
    setCurrentDate(new Date(t.getFullYear(), t.getMonth(), 1));
  };

  // ── Calendar grid generation ────────────────────────────────────────────────
  const calendarGrid = useMemo(() => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let startDOW = firstDay.getDay() - 1;
    if (startDOW === -1) startDOW = 6;

    const daysInMonth = lastDay.getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells: { dateStr: string; dayNumber: number; isCurrentMonth: boolean }[] = [];

    for (let i = startDOW - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prev = new Date(year, month - 1, d);
      cells.push({
        dateStr: `${prev.getFullYear()}-${pad(prev.getMonth() + 1)}-${pad(d)}`,
        dayNumber: d,
        isCurrentMonth: false,
      });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        dateStr: `${year}-${pad(month + 1)}-${pad(d)}`,
        dayNumber: d,
        isCurrentMonth: true,
      });
    }
    const totalCells = cells.length > 35 ? 42 : 35;
    for (let d = 1; cells.length < totalCells; d++) {
      const next = new Date(year, month + 1, d);
      cells.push({
        dateStr: `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(d)}`,
        dayNumber: d,
        isCurrentMonth: false,
      });
    }
    return cells;
  }, [year, month]);

  // ── Month stats ─────────────────────────────────────────────────────────────
  const currentMonthStats = useMemo(() => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    const prefix = `${year}-${pad(month + 1)}`;
    const monthSchedules = schedules.filter((s) => s.date.startsWith(prefix));
    const monthGoogle = googleEvents.filter((ev) => isoToDateStr(ev.start).startsWith(prefix));
    return {
      total: monthSchedules.length,
      aktif: monthSchedules.filter((s) => s.status === "aktif").length,
      selesai: monthSchedules.filter((s) => s.status === "selesai").length,
      googleTotal: monthGoogle.length,
    };
  }, [schedules, googleEvents, year, month]);

  // Selected date events for modal
  const selectedDateSchedules = activeSelectedDate ? (schedulesByDate[activeSelectedDate] || []) : [];
  const selectedDateGoogle = activeSelectedDate ? (googleByDate[activeSelectedDate] || []) : [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-all relative">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 border border-slate-700 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Calendar Header with Controls */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-50/50 via-white to-blue-50/20">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#044085] to-[#005BAA] text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-900/20">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {MONTH_NAMES_ID[month]} {year}
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100/70 text-[#005BAA] border border-blue-200">
                <span className="w-1.5 h-1.5 rounded-full bg-[#005BAA] animate-pulse" />
                Live Sync
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Klik tanggal untuk melihat rincian sesi atau membuat jadwal baru.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Push to Google Calendar */}
          <button
            onClick={handlePushAllToGoogle}
            disabled={syncingAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-[#005BAA] to-[#044085] hover:brightness-110 text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50"
            title="Kirim semua jadwal konsultasi ke Google Calendar"
          >
            {syncingAll ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <UploadCloud className="w-3.5 h-3.5" />
            )}
            <span>{syncingAll ? "Menyinkronkan..." : "Kirim ke Google"}</span>
          </button>

          {/* Pull from Google */}
          <button
            onClick={loadGoogleEvents}
            disabled={gcalLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 text-slate-700 hover:text-orange-600 text-xs font-bold rounded-xl transition-all"
            title="Muat ulang acara dari Google Calendar"
          >
            {gcalLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            <span>{gcalLoading ? "Tarik Data..." : "Tarik Google"}</span>
          </button>

          {/* Month Segmented Navigation */}
          <div className="inline-flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 transition-colors"
              title="Bulan Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1 text-xs font-extrabold text-[#005BAA] hover:bg-white rounded-lg transition-colors"
              title="Kembali ke Hari Ini"
            >
              Hari Ini
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 transition-colors"
              title="Bulan Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Status Selector */}
          <div className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ScheduleStatus | "semua")}
              className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer pr-1"
            >
              <option value="semua">Semua Status</option>
              <option value="aktif">Aktif / Terjadwal</option>
              <option value="selesai">Selesai</option>
              <option value="dibatalkan">Dibatalkan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Summary Bar & Legend */}
      <div className="px-6 py-3 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            Bulan {MONTH_NAMES_ID[month]}:
          </span>
          <span className="inline-flex items-center gap-1.5 font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-[#005BAA]" />
            Total: {currentMonthStats.total}
          </span>
          <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50/70 px-2.5 py-1 rounded-lg border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Aktif: {currentMonthStats.aktif}
          </span>
          <span className="inline-flex items-center gap-1.5 font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            Selesai: {currentMonthStats.selesai}
          </span>
          {currentMonthStats.googleTotal > 0 && (
            <span className="inline-flex items-center gap-1.5 font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
              <span className="w-2 h-2 rounded-full bg-[#F7941D]" />
              Google Calendar: {currentMonthStats.googleTotal}
            </span>
          )}
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500" /> Virtual Zoom
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Tatap Muka
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F7941D]" /> G-Calendar
          </span>
        </div>
      </div>

      {/* Weekday Header */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-100/80 text-center">
        {WEEKDAY_NAMES_ID.map((day) => (
          <div
            key={day.full}
            className={`py-3 text-xs font-black uppercase tracking-wider ${
              day.isWeekend ? "text-rose-600 bg-rose-50/30" : "text-slate-700"
            }`}
          >
            <span className="hidden sm:inline">{day.full}</span>
            <span className="sm:hidden">{day.short}</span>
          </div>
        ))}
      </div>

      {/* Month Days Grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-slate-200/80 bg-slate-100/40">
        {calendarGrid.map((cell) => {
          const isToday = cell.dateStr === todayStr;
          const isSelected = cell.dateStr === activeSelectedDate;
          const daySchedules = schedulesByDate[cell.dateStr] || [];
          const dayGoogleEvents = googleByDate[cell.dateStr] || [];
          const totalEvents = daySchedules.length + dayGoogleEvents.length;

          return (
            <div
              key={cell.dateStr}
              onClick={() => handleCellClick(cell.dateStr)}
              className={`min-h-[100px] sm:min-h-[125px] p-2 transition-all duration-150 relative cursor-pointer group flex flex-col justify-between ${
                cell.isCurrentMonth ? "bg-white" : "bg-slate-50/60 opacity-55"
              } ${
                isSelected
                  ? "ring-2 ring-[#005BAA] ring-inset bg-blue-50/50 z-10 shadow-xs"
                  : "hover:bg-blue-50/40 hover:shadow-xs"
              }`}
            >
              {/* Date Header: Day number + Badges */}
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-xl text-xs font-black transition-all ${
                    isToday
                      ? "bg-gradient-to-tr from-[#044085] to-[#005BAA] text-white shadow-sm ring-2 ring-blue-300"
                      : cell.isCurrentMonth
                      ? "text-slate-800 group-hover:text-[#005BAA] group-hover:bg-blue-100/50"
                      : "text-slate-400"
                  }`}
                >
                  {cell.dayNumber}
                </span>

                {totalEvents > 0 ? (
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      daySchedules.some((s) => s.status === "aktif")
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-slate-100 text-slate-700 border border-slate-200"
                    }`}
                  >
                    {totalEvents}
                    <span className="hidden lg:inline ml-1 font-semibold">sesi</span>
                  </span>
                ) : (
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-[#005BAA]">
                    <Plus className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              {/* Day Events Stack */}
              <div className="space-y-1 flex-1 overflow-hidden my-0.5">
                {/* Consultation items */}
                {daySchedules.slice(0, 2).map((item) => {
                  const isOnline = item.method === "online";
                  const statusStyle =
                    item.status === "aktif"
                      ? "bg-emerald-50 text-emerald-900 border-emerald-200/80 hover:bg-emerald-100"
                      : item.status === "selesai"
                      ? "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                      : "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100";

                  return (
                    <div
                      key={item.scheduleId}
                      className={`text-[10px] sm:text-[11px] font-bold px-2 py-1 rounded-lg border truncate flex items-center gap-1.5 transition-all shadow-2xs ${statusStyle}`}
                      title={`${item.startTime} WIB - ${item.name} (${item.institution})`}
                    >
                      {isOnline ? (
                        <Video className="w-3 h-3 text-purple-600 shrink-0" />
                      ) : (
                        <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                      )}
                      <span className="font-mono text-[9px] shrink-0 text-slate-600">
                        {item.startTime}
                      </span>
                      <span className="truncate">{item.name}</span>
                    </div>
                  );
                })}

                {/* Google Calendar items */}
                {dayGoogleEvents
                  .slice(0, daySchedules.length >= 2 ? 0 : 2 - daySchedules.length)
                  .map((ev) => (
                    <div
                      key={ev.id}
                      className="text-[10px] sm:text-[11px] font-bold px-2 py-1 rounded-lg border truncate flex items-center gap-1.5 bg-orange-50 text-orange-900 border-orange-200 hover:bg-orange-100 transition-all shadow-2xs"
                      title={`${ev.isAllDay ? "Seharian" : isoToTimeStr(ev.start)} - ${ev.summary}`}
                    >
                      <CalendarIcon className="w-3 h-3 text-[#F7941D] shrink-0" />
                      {!ev.isAllDay && (
                        <span className="font-mono text-[9px] shrink-0 text-orange-700">
                          {isoToTimeStr(ev.start)}
                        </span>
                      )}
                      <span className="truncate">{ev.summary}</span>
                    </div>
                  ))}

                {/* Overflow count */}
                {(() => {
                  const maxShown = 2;
                  const total = daySchedules.length + dayGoogleEvents.length;
                  if (total > maxShown) {
                    return (
                      <div className="text-[10px] font-extrabold text-[#005BAA] px-1 hover:underline">
                        +{total - maxShown} agenda lainnya...
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Date Schedule Modal */}
      {isModalOpen && activeSelectedDate && (
        <DateScheduleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedDate={activeSelectedDate}
          schedules={selectedDateSchedules}
          googleEvents={selectedDateGoogle}
        />
      )}
    </div>
  );
}
