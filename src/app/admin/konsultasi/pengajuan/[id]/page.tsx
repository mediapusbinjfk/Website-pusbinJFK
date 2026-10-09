"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  ArrowLeft, User, Phone, Mail, Building2, Briefcase,
  MessageCircle, Calendar, FileText, ExternalLink,
  CheckCircle, X, CalendarCheck, Send, Clock, Video,
  CheckCircle2, Share2, MapPin
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function DetailPengajuanPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = React.use(paramsPromise);
  const router = useRouter();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleStart, setScheduleStart] = useState("09:00");
  const [scheduleEnd, setScheduleEnd] = useState("10:00");
  const [scheduleMethod, setScheduleMethod] = useState<MeetingMethod>("online");
  const [zoomLink, setZoomLink] = useState("https://zoom.us/j/9876543210");
  const [scheduleNotes, setScheduleNotes] = useState("");
  const [savingSchedule, setSavingSchedule] = useState(false);

  useEffect(() => {
    const list = ConsultationStore.getConsultations();
    const found = list.find((c) => c.id === params.id) || list[0];
    if (found) {
      setConsultation(found);
      setScheduleDate(found.estimatedDate || new Date().toISOString().split("T")[0]);
      if (found.estimatedTime) {
        const parts = found.estimatedTime.replace(/WIB/gi, "").trim().split(/[-–]/);
        if (parts.length >= 2) {
          setScheduleStart(parts[0].trim().replace(".", ":"));
          setScheduleEnd(parts[1].trim().replace(".", ":"));
        }
      }
      setScheduleMethod(found.consultationMethod === "zoom" ? "online" : "offline");
      setScheduleNotes(found.notes || "");
    }
  }, [params.id]);

  if (!consultation) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-slate-500">Memuat data pengajuan...</div>
      </AdminLayout>
    );
  }

  const statusCfg = STATUS_CONFIG[consultation.status] || STATUS_CONFIG.menunggu;

  const handleSaveSchedule = async () => {
    setSavingSchedule(true);
    const isOnline = scheduleMethod === "online";

    ConsultationStore.scheduleConsultation(consultation.id, {
      date: scheduleDate,
      startTime: scheduleStart,
      endTime: scheduleEnd,
      method: scheduleMethod,
      platform: isOnline ? "Zoom Meeting" : undefined,
      meetingLink: isOnline ? zoomLink : undefined,
      location: !isOnline ? "Gedung Graha BNPB Lt. 8" : undefined,
      room: !isOnline ? "Ruang Rapat Pembinaan JF Kebencanaan Lt. 8" : undefined,
      notes: scheduleNotes,
    });

    setSavingSchedule(false);
    setShowScheduleModal(false);

    // Refresh state
    const updated = ConsultationStore.getConsultations().find((c) => c.id === consultation.id);
    if (updated) setConsultation(updated);

    setToastMessage("Konsultasi berhasil dijadwalkan dan dipindahkan ke Jadwal Konsultasi!");
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in text-sm font-medium border border-slate-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Back & Top Bar */}
        <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/konsultasi/pengajuan"
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900">Detail Pengajuan Konsultasi</h1>
                <span className="font-mono text-xs font-bold text-[#005BAA] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                  {consultation.id}
                </span>
              </div>
              <p className="text-xs text-slate-400">Diajukan pada: {consultation.createdAt.split("T")[0]}</p>
            </div>
          </div>

          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusCfg.className}`}>
            {statusCfg.label}
          </span>
        </div>

        {/* Notif jika sudah terjadwal */}
        {consultation.status === "terjadwal" && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-900">Pengajuan Ini Sudah Dijadwalkan</p>
                <p className="text-xs text-emerald-700">
                  Data telah aktif di kalender Jadwal Konsultasi dan tidak lagi menumpuk di antrean pengajuan.
                </p>
              </div>
            </div>
            <Link
              href="/admin/konsultasi/jadwal"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shrink-0"
            >
              Lihat di Jadwal Konsultasi
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Info (Col 8) */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* KARTU ESTIMASI WAKTU YANG DIMINTA PEMOHON */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 p-5 rounded-2xl border border-blue-200/80 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-[#005BAA]">
                <Clock className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Estimasi Waktu yang Diminta Pemohon</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                <div className="bg-white p-3.5 rounded-xl border border-blue-100">
                  <p className="text-[11px] text-slate-400 font-medium">Tanggal Konsultasi Diminta</p>
                  <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <Calendar className="w-4 h-4 text-[#005BAA]" />
                    {consultation.estimatedDate || "-"}
                  </p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-blue-100">
                  <p className="text-[11px] text-slate-400 font-medium">Sesi Jam yang Diminta</p>
                  <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-4 h-4 text-[#F7941D]" />
                    {consultation.estimatedTime || "09.00 – 10.00 WIB"}
                  </p>
                </div>
              </div>
            </div>

            {/* Identitas Pemohon */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-[#005BAA]" />
                Identitas Pemohon
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Nama Lengkap</span>
                  <span className="text-sm font-bold text-slate-900">{consultation.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Nomor WhatsApp</span>
                  <a
                    href={`https://wa.me/${consultation.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-emerald-600 hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {consultation.whatsapp}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Instansi / Unit Kerja</span>
                  <span className="font-semibold text-slate-800">{consultation.institution}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Jabatan</span>
                  <span className="font-semibold text-slate-800">{consultation.position}</span>
                </div>
                {consultation.email && (
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block mb-0.5">Alamat Email</span>
                    <span className="font-medium text-slate-700">{consultation.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Pokok Permasalahan & Dokumen */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#005BAA]" />
                Topik & Permasalahan
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Topik Utama</span>
                  <span className="text-sm font-bold text-[#005BAA]">{consultation.topic}</span>
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Uraian / Catatan Pertanyaan</span>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed font-normal">
                    {consultation.notes || "Tidak ada catatan tambahan yang dicantumkan."}
                  </div>
                </div>

                {consultation.documentFileName && (
                  <div className="pt-2">
                    <span className="text-slate-400 block mb-1">Surat Pengantar Dinas</span>
                    <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-red-500" />
                        <span className="font-medium text-slate-800">{consultation.documentFileName}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">PDF Dokumen</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Tindakan (Col 4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Tindakan Cepat
              </h3>

              {(consultation.status === "menunggu" || consultation.status === "diproses") ? (
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm active:scale-98"
                >
                  <CalendarCheck className="w-4 h-4" />
                  Jadwalkan Konsultasi Sekarang
                </button>
              ) : (
                <Link
                  href="/admin/konsultasi/jadwal"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#005BAA] hover:bg-[#003F7D] text-white font-bold rounded-xl text-xs transition-all shadow-sm"
                >
                  <Calendar className="w-4 h-4" />
                  Buka Jadwal Terdaftar
                </Link>
              )}

              {/* Hubungi WA */}
              <a
                href={`https://wa.me/${consultation.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                  `Halo Bapak/Ibu ${consultation.name}, kami dari Pembinaan JF BNPB menghubungi terkait permohonan konsultasi (${consultation.id}).`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-xl text-xs transition-all border border-emerald-200"
              >
                <Share2 className="w-3.5 h-3.5" />
                Chat WhatsApp Pemohon
              </a>
            </div>

            {/* Box Ringkasan Alur */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
              <p className="font-bold text-slate-800">Alur Sederhana & Otomatis:</p>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Setelah jadwal disimpan, pengajuan ini otomatis berpindah ke menu <strong>Jadwal Konsultasi</strong> dan hilang dari antrean pengajuan agar tidak menumpuk.
              </p>
            </div>
          </div>
        </div>

        {/* MODAL PENJADWALAN SIMPLE & USER-FRIENDLY */}
        {showScheduleModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100 animate-scale-up">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Jadwalkan Konsultasi</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {consultation.name} · <span className="text-[#005BAA] font-semibold">{consultation.institution}</span>
                  </p>
                </div>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Estimasi dari pemohon */}
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs">
                <span className="text-blue-900 font-bold">Estimasi Diminta Pemohon: </span>
                <span className="text-blue-800 font-semibold">{consultation.estimatedDate || "-"}</span> pukul <span className="text-blue-800 font-semibold">{consultation.estimatedTime || "09.00 – 10.00 WIB"}</span>
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
                      placeholder="Contoh: https://zoom.us/j/123456789"
                      value={zoomLink}
                      onChange={(e) => setZoomLink(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-xs text-blue-700 font-mono bg-white"
                    />
                  </div>
                )}

                {/* JIKA TATAP MUKA: GRAHA BNPB LT. 8 */}
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
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={savingSchedule}
                  onClick={handleSaveSchedule}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
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
