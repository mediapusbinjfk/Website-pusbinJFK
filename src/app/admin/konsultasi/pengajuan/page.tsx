"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Search, Eye, Phone, Calendar, CalendarCheck,
  CheckCircle2, Clock, X, Video, Building2,
  ExternalLink, ArrowRight, AlertCircle
} from "lucide-react";
import Link from "next/link";
import type { Consultation, ConsultationStatus, MeetingMethod } from "@/types/admin";
import { ConsultationStore } from "@/lib/consultationStore";

const STATUS_CONFIG: Record<ConsultationStatus, { label: string; className: string }> = {
  menunggu: { label: "Menunggu Jadwal", className: "bg-amber-50 text-amber-700 border border-amber-200" },
  diproses: { label: "Diproses", className: "bg-blue-50 text-blue-700 border border-blue-200" },
  terjadwal: { label: "Terjadwal", className: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  selesai: { label: "Selesai", className: "bg-slate-100 text-slate-600 border border-slate-200" },
  dibatalkan: { label: "Dibatalkan", className: "bg-red-50 text-red-600 border border-red-200" },
  ditolak: { label: "Ditolak", className: "bg-red-50 text-red-700 border border-red-200" },
};

export default function AdminPengajuanPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [search, setSearch] = useState("");
  const [viewTab, setViewTab] = useState<"pending" | "all">("pending");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick Schedule Modal state
  const [scheduleModalTarget, setScheduleModalTarget] = useState<Consultation | null>(null);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleStart, setScheduleStart] = useState("09:00");
  const [scheduleEnd, setScheduleEnd] = useState("10:00");
  const [scheduleMethod, setScheduleMethod] = useState<MeetingMethod>("online");
  const [zoomLink, setZoomLink] = useState("https://zoom.us/j/9876543210");
  const [savingSchedule, setSavingSchedule] = useState(false);

  const loadData = () => {
    setConsultations(ConsultationStore.getConsultations());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter pending items (menunggu / diproses)
  const pendingItems = consultations.filter((c) => c.status === "menunggu" || c.status === "diproses");

  // Displayed items based on tab & search
  const displayedList = (viewTab === "pending" ? pendingItems : consultations).filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.institution.toLowerCase().includes(q) ||
      c.topic.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    );
  });

  // Open Quick Schedule Modal
  const handleOpenScheduleModal = (c: Consultation) => {
    setScheduleModalTarget(c);
    setScheduleDate(c.estimatedDate || new Date().toISOString().split("T")[0]);

    // Parse estimated time if available (e.g. "09.00 – 10.00 WIB" or "13:00 - 14:00")
    if (c.estimatedTime) {
      const parts = c.estimatedTime.replace(/WIB/gi, "").trim().split(/[-–]/);
      if (parts.length >= 2) {
        setScheduleStart(parts[0].trim().replace(".", ":"));
        setScheduleEnd(parts[1].trim().replace(".", ":"));
      } else {
        setScheduleStart("09:00");
        setScheduleEnd("10:00");
      }
    } else {
      setScheduleStart("09:00");
      setScheduleEnd("10:00");
    }

    const isZoom = c.consultationMethod === "zoom";
    setScheduleMethod(isZoom ? "online" : "offline");
    if (isZoom && !zoomLink) {
      setZoomLink("https://zoom.us/j/9876543210");
    }
  };

  // Save Schedule
  const handleSaveSchedule = async () => {
    if (!scheduleModalTarget) return;
    setSavingSchedule(true);

    const isOnline = scheduleMethod === "online";
    ConsultationStore.scheduleConsultation(scheduleModalTarget.id, {
      date: scheduleDate,
      startTime: scheduleStart,
      endTime: scheduleEnd,
      method: scheduleMethod,
      platform: isOnline ? "Zoom Meeting" : undefined,
      meetingLink: isOnline ? zoomLink : undefined,
      location: !isOnline ? "Gedung Graha BNPB Lt. 8" : undefined,
      room: !isOnline ? "Ruang Rapat Pembinaan JF Kebencanaan Lt. 8" : undefined,
      notes: scheduleModalTarget.notes,
    });

    setSavingSchedule(false);
    setScheduleModalTarget(null);
    loadData();

    showToast(`Konsultasi ${scheduleModalTarget.id} berhasil dijadwalkan dan dipindahkan ke Jadwal Konsultasi!`);
  };

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-7xl mx-auto">
        {/* Toast Notif */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in text-sm font-medium border border-slate-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header Bersih & Ringkas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Pengajuan Konsultasi</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola permintaan konsultasi. Pengajuan yang telah dijadwalkan otomatis masuk ke <strong>Jadwal Konsultasi</strong> agar tidak menumpuk.
            </p>
          </div>

          <Link
            href="/admin/konsultasi/jadwal"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#005BAA] hover:bg-[#003F7D] text-white text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
          >
            <Calendar className="w-3.5 h-3.5" />
            Lihat Jadwal Konsultasi ({consultations.filter(c => c.status === "terjadwal").length})
          </Link>
        </div>

        {/* Tab & Search Bar Simpel */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Toggle Tab */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setViewTab("pending")}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                viewTab === "pending"
                  ? "bg-white text-[#005BAA] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Antrean Pengajuan</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] ${
                viewTab === "pending" ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-700"
              }`}>
                {pendingItems.length}
              </span>
            </button>

            <button
              onClick={() => setViewTab("all")}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewTab === "all"
                  ? "bg-white text-[#005BAA] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Semua Riwayat ({consultations.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama, instansi, atau topik..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-xs transition-all bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Tabel Data Konsultasi */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {displayedList.length === 0 ? (
            <div className="text-center py-14 px-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                {viewTab === "pending" ? "Tidak Ada Antrean Pengajuan Menumpuk" : "Data Tidak Ditemukan"}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                {viewTab === "pending"
                  ? "Seluruh pengajuan sudah langsung dijadwalkan dan tercatat di Jadwal Konsultasi."
                  : "Silakan ubah kata kunci pencarian Anda."}
              </p>
              <Link
                href="/admin/konsultasi/jadwal"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
              >
                <Calendar className="w-3.5 h-3.5" />
                Buka Menu Jadwal Konsultasi
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-5">ID & Pemohon</th>
                    <th className="py-3 px-5">Topik Konsultasi</th>
                    <th className="py-3 px-5">Estimasi Waktu Diminta</th>
                    <th className="py-3 px-5">Format</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedList.map((item) => {
                    const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.menunggu;
                    const isZoom = item.consultationMethod === "zoom";
                    const isTatapMuka = item.consultationMethod === "tatap-muka";

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Kolom 1: ID & Pemohon */}
                        <td className="py-3.5 px-5">
                          <div className="font-mono text-[11px] font-bold text-[#005BAA]">{item.id}</div>
                          <div className="font-semibold text-slate-900 text-sm mt-0.5">{item.name}</div>
                          <div className="text-slate-500 mt-0.5">{item.institution}</div>
                          {item.whatsapp && (
                            <a
                              href={`https://wa.me/${item.whatsapp.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-emerald-600 hover:underline mt-1"
                            >
                              <Phone className="w-3 h-3" />
                              {item.whatsapp}
                            </a>
                          )}
                        </td>

                        {/* Kolom 2: Topik */}
                        <td className="py-3.5 px-5 max-w-xs">
                          <span className="font-semibold text-slate-800 block text-xs">{item.topic}</span>
                          {item.notes && (
                            <span className="text-slate-400 line-clamp-2 mt-0.5 text-[11px]">
                              {item.notes}
                            </span>
                          )}
                        </td>

                        {/* Kolom 3: ESTIMASI WAKTU DIMINTA PEMOHON */}
                        <td className="py-3.5 px-5">
                          <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-2.5 max-w-[200px]">
                            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                              <Calendar className="w-3.5 h-3.5 text-[#005BAA]" />
                              <span>{item.estimatedDate || "-"}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600 text-[11px] mt-1 font-medium">
                              <Clock className="w-3 h-3 text-[#F7941D]" />
                              <span>{item.estimatedTime || "09.00 – 10.00 WIB"}</span>
                            </div>
                          </div>
                        </td>

                        {/* Kolom 4: Format Konsultasi */}
                        <td className="py-3.5 px-5">
                          {isZoom ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-200">
                              <Video className="w-3 h-3 text-blue-600" />
                              Zoom Meeting
                            </span>
                          ) : isTatapMuka ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-semibold border border-amber-200">
                              <Building2 className="w-3 h-3 text-amber-600" />
                              Graha BNPB Lt. 8
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                              <Phone className="w-3 h-3" />
                              Chat WA
                            </span>
                          )}
                        </td>

                        {/* Kolom 5: Status */}
                        <td className="py-3.5 px-5">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusCfg.className}`}>
                            {statusCfg.label}
                          </span>
                        </td>

                        {/* Kolom 6: Aksi */}
                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Tombol Buat Jadwal: Langsung buka modal */}
                            {item.status !== "terjadwal" && item.status !== "selesai" && (
                              <button
                                onClick={() => handleOpenScheduleModal(item)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                                title="Jadwalkan sekarang"
                              >
                                <CalendarCheck className="w-3.5 h-3.5" />
                                Jadwalkan
                              </button>
                            )}

                            <Link
                              href={`/admin/konsultasi/pengajuan/${item.id}`}
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                              title="Lihat Detail Pengajuan"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* MODAL PENJADWALAN CEPAT & SIMPLE (TIDAK BERBELIT-BELIT)      */}
        {/* ============================================================ */}
        {scheduleModalTarget && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100 animate-scale-up">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Jadwalkan Konsultasi</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {scheduleModalTarget.name} · <span className="text-[#005BAA] font-semibold">{scheduleModalTarget.institution}</span>
                  </p>
                </div>
                <button
                  onClick={() => setScheduleModalTarget(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Box Estimasi Waktu yang Diminta Pemohon */}
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs space-y-1">
                <div className="font-semibold text-blue-900 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#005BAA]" />
                  <span>Permintaan Estimasi dari Pemohon:</span>
                </div>
                <div className="text-blue-800 font-medium">
                  Tanggal: <strong>{scheduleModalTarget.estimatedDate || "-"}</strong> · Waktu: <strong>{scheduleModalTarget.estimatedTime || "09.00 – 10.00 WIB"}</strong>
                </div>
              </div>

              {/* Form Input Ringkas */}
              <div className="space-y-4 text-xs">
                
                {/* Tanggal */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tanggal Pertemuan</label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-xs bg-white"
                  />
                </div>

                {/* Jam Mulai & Selesai */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Jam Mulai</label>
                    <input
                      type="time"
                      value={scheduleStart}
                      onChange={(e) => setScheduleStart(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Jam Selesai</label>
                    <input
                      type="time"
                      value={scheduleEnd}
                      onChange={(e) => setScheduleEnd(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-xs"
                    />
                  </div>
                </div>

                {/* Pilihan Metode: Online vs Tatap Muka */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Metode Pertemuan</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setScheduleMethod("online")}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        scheduleMethod === "online"
                          ? "border-[#005BAA] bg-[#005BAA] text-white shadow-xs"
                          : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      Online (Zoom)
                    </button>

                    <button
                      type="button"
                      onClick={() => setScheduleMethod("offline")}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        scheduleMethod === "offline"
                          ? "border-amber-600 bg-amber-600 text-white shadow-xs"
                          : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      Tatap Muka
                    </button>
                  </div>
                </div>

                {/* JIKA ONLINE: KOLOM MEMBERIKAN LINK ZOOM */}
                {scheduleMethod === "online" && (
                  <div className="space-y-1.5 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                    <label className="font-bold text-slate-800 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-blue-600" />
                        Link Zoom Meeting / Google Meet <span className="text-red-500">*</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setZoomLink("https://zoom.us/j/9876543210")}
                        className="text-[10px] text-[#005BAA] hover:underline font-normal"
                      >
                        Gunakan Default
                      </button>
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="Masukkan tautan Zoom, contoh: https://zoom.us/j/123456789"
                      value={zoomLink}
                      onChange={(e) => setZoomLink(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-xs text-blue-700 font-mono bg-white"
                    />
                    <p className="text-[10px] text-slate-500">
                      Tautan ini akan tersimpan di jadwal dan siap dibagikan ke pemohon melalui WhatsApp.
                    </p>
                  </div>
                )}

                {/* JIKA TATAP MUKA: OTOMATIS GRAHA BNPB LT. 8 */}
                {scheduleMethod === "offline" && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                      <Building2 className="w-4 h-4 text-amber-600" />
                      Lokasi: Gedung Graha BNPB Lt. 8
                    </div>
                    <p className="text-[11px] text-amber-800">
                      Ruang Rapat Pembinaan JF Kebencanaan Lt. 8
                    </p>
                    <p className="text-[10px] text-amber-700">
                      Jl. Pramuka No. 38, Matraman, Jakarta Timur 13120
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setScheduleModalTarget(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={savingSchedule}
                  onClick={handleSaveSchedule}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                >
                  <CalendarCheck className="w-4 h-4" />
                  {savingSchedule ? "Menyimpan..." : "Simpan & Masuk Jadwal"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
