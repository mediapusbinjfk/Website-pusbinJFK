"use client";

import React from "react";
import {
  X,
  Calendar,
  Clock,
  User,
  Building2,
  Video,
  MapPin,
  ExternalLink,
  MessageCircle,
  Mail,
  CalendarCheck,
  CalendarDays,
} from "lucide-react";
import type { MeetingMethod, ScheduleStatus } from "@/types/admin";
import type { GoogleCalendarEvent } from "@/lib/googleCalendar";

export interface EnrichedSchedule {
  scheduleId: string;
  consultationId: string;
  date: string;
  startTime: string;
  endTime: string;
  method: MeetingMethod;
  platform?: string;
  meetingLink?: string;
  location?: string;
  room?: string;
  notes?: string;
  status: ScheduleStatus;
  createdBy: string;
  createdAt: string;
  name: string;
  institution: string;
  position?: string;
  whatsapp?: string;
  email?: string;
  topic: string;
  consultationNotes?: string;
}

interface DateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string; // YYYY-MM-DD
  schedules: EnrichedSchedule[];
  googleEvents?: GoogleCalendarEvent[];
}

export function DateScheduleModal({
  isOpen,
  onClose,
  selectedDate,
  schedules,
  googleEvents = [],
}: DateScheduleModalProps) {
  if (!isOpen) return null;

  // Format date to Indonesian
  const formattedDate = (() => {
    try {
      const [y, m, d] = selectedDate.split("-").map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return selectedDate;
    }
  })();

  const totalEvents = schedules.length + googleEvents.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 z-10 my-6 overflow-hidden flex flex-col max-h-[90vh] transform transition-all animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#044085] via-[#005BAA] to-[#003F7D] text-white px-6 py-5 shrink-0 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-56 h-56 bg-white/5 rounded-full blur-2xl pointer-events-none -mr-12 -mt-12" />

          <div className="flex items-start justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-xs">
                  <Calendar className="w-3.5 h-3.5 text-[#F7941D]" />
                  Informasi Agenda & Jadwal
                </span>
                <span className="text-xs text-blue-100 font-mono font-medium">
                  {selectedDate}
                </span>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white">
                {formattedDate}
              </h3>
              <p className="text-xs text-blue-100/90 mt-0.5">
                Total {totalEvents} agenda ({schedules.length} konsultasi portal, {googleEvents.length} Google Calendar)
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all shrink-0 focus:outline-none"
              aria-label="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50 space-y-5">
          {totalEvents === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#005BAA] flex items-center justify-center mx-auto mb-3 shadow-inner">
                <CalendarCheck className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-800">
                Tidak Ada Jadwal
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-2 leading-relaxed">
                Belum ada agenda atau konsultasi yang terjadwal untuk {formattedDate}.
              </p>
            </div>
          ) : (
            <>
              {/* Google Calendar Events Section */}
              {googleEvents.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
                    Google Calendar Events ({googleEvents.length})
                  </div>
                  {googleEvents.map((ev) => {
                    const startStr = ev.isAllDay
                      ? "Sepanjang Hari"
                      : new Date(ev.start).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: "Asia/Jakarta",
                        }) +
                        " – " +
                        new Date(ev.end).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: "Asia/Jakarta",
                        }) + " WIB";

                    return (
                      <div
                        key={ev.id}
                        className="bg-white rounded-2xl border border-orange-200/80 p-5 shadow-xs hover:shadow-md transition-all relative overflow-hidden"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-500" />
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200">
                            <Clock className="w-3.5 h-3.5" />
                            {startStr}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
                            <CalendarDays className="w-3 h-3 text-orange-600" />
                            Google Calendar
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900 mt-1">
                          {ev.summary}
                        </h4>

                        {ev.location && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{ev.location}</span>
                          </div>
                        )}

                        {ev.description && (
                          <div className="mt-2.5 p-3 rounded-xl bg-orange-50/40 border border-orange-100 text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans">
                            {ev.description}
                          </div>
                        )}

                        {ev.htmlLink && (
                          <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
                            <a
                              href={ev.htmlLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline"
                            >
                              <span>Buka di Google Calendar</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Consultation Schedules Section */}
              {schedules.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#005BAA] inline-block" />
                    Jadwal Konsultasi JF BNPB ({schedules.length})
                  </div>
                  {schedules.map((item) => {
                    const isOnline = item.method === "online";
                    const statusBg =
                      item.status === "aktif"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : item.status === "selesai"
                        ? "bg-slate-100 text-slate-700 border-slate-200"
                        : "bg-rose-50 text-rose-700 border-rose-200";

                    return (
                      <div
                        key={item.scheduleId}
                        className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all relative overflow-hidden"
                      >
                        <div
                          className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                            item.status === "aktif"
                              ? "bg-emerald-500"
                              : item.status === "selesai"
                              ? "bg-slate-400"
                              : "bg-rose-500"
                          }`}
                        />

                        {/* Header info */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-blue-50 text-[#005BAA] border border-blue-100">
                              <Clock className="w-3.5 h-3.5" />
                              {item.startTime} – {item.endTime} WIB
                            </span>

                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold ${
                                isOnline
                                  ? "bg-purple-50 text-purple-700 border border-purple-100"
                                  : "bg-amber-50 text-amber-800 border border-amber-100"
                              }`}
                            >
                              {isOnline ? (
                                <Video className="w-3.5 h-3.5 text-purple-600" />
                              ) : (
                                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                              )}
                              {isOnline ? "Online (Virtual Meeting)" : "Tatap Muka (Offline)"}
                            </span>

                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border capitalize ${statusBg}`}
                            >
                              {item.status}
                            </span>
                          </div>

                          <div className="text-[11px] font-mono text-slate-400">
                            {item.scheduleId}
                          </div>
                        </div>

                        {/* Client Info */}
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-[#005BAA] shrink-0" />
                              <h4 className="text-base font-bold text-slate-900">
                                {item.name}
                              </h4>
                            </div>

                            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 mt-1 pl-6">
                              <span className="flex items-center gap-1 font-semibold text-slate-700">
                                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                {item.institution}
                              </span>
                              {item.position && (
                                <span className="text-slate-500">
                                  · {item.position}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Topic */}
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                            <span className="text-slate-400 font-medium">Topik: </span>
                            <span className="font-bold text-[#005BAA] ml-1">
                              {item.topic}
                            </span>
                          </div>

                          {/* Location / Meeting Link */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 font-medium">Tempat:</span>
                              {isOnline ? (
                                item.meetingLink ? (
                                  <a
                                    href={item.meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[#005BAA] font-semibold hover:underline bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100"
                                  >
                                    <span>{item.platform || "Tautan Rapat Virtual"}</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                ) : (
                                  <span className="text-slate-400 italic">Belum ada tautan</span>
                                )
                              ) : (
                                <span className="font-medium text-slate-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100 text-amber-800">
                                  {item.room || item.location || "Gedung Graha BNPB Lt. 8"}
                                </span>
                              )}
                            </div>

                            {/* Contacts */}
                            <div className="flex items-center gap-3">
                              {item.whatsapp && (
                                <a
                                  href={`https://wa.me/${item.whatsapp.replace(/\D/g, "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold hover:underline"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>{item.whatsapp}</span>
                                </a>
                              )}
                              {item.email && (
                                <a
                                  href={`mailto:${item.email}`}
                                  className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 hover:underline"
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                  <span>Email</span>
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Notes if any */}
                          {(item.notes || item.consultationNotes) && (
                            <div className="text-xs text-slate-600 bg-amber-50/60 p-2.5 rounded-xl border border-amber-100/60">
                              <span className="font-semibold text-amber-900">Catatan: </span>
                              <span className="italic">{item.notes || item.consultationNotes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Total {totalEvents} Jadwal & Agenda
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
