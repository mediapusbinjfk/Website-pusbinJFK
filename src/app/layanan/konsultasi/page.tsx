"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import {
  Send, User, Mail, MessageSquare, Phone, MapPin, Clock, CheckCircle,
  Video, Building2, Briefcase, Calendar, FileText, X
} from "lucide-react";
import { PageTransition } from "@/components/ui/PageTransition";
import { ConsultationStore } from "@/lib/consultationStore";

const topics = [
  { value: "", label: "Pilih topik konsultasi..." },
  { value: "Uji Kompetensi (UKOM)", label: "Uji Kompetensi (UKOM)" },
  { value: "Penilaian Angka Kredit (PAK)", label: "Penilaian Angka Kredit (PAK)" },
  { value: "Kenaikan Pangkat / Jabatan", label: "Kenaikan Pangkat / Jabatan" },
  { value: "Inpassing / Pengangkatan Pertama", label: "Inpassing / Pengangkatan Pertama" },
  { value: "Konsultasi Kebijakan & Regulasi JF", label: "Konsultasi Kebijakan & Regulasi JF" },
  { value: "Lainnya", label: "Lainnya" },
];

const TIME_SLOTS = [
  { id: "slot-1", label: "09.00 – 10.00 WIB", start: "09:00", end: "10:00", period: "Pagi" },
  { id: "slot-2", label: "10.00 – 11.00 WIB", start: "10:00", end: "11:00", period: "Pagi" },
  { id: "slot-3", label: "13.00 – 14.00 WIB", start: "13:00", end: "14:00", period: "Siang" },
  { id: "slot-4", label: "14.00 – 15.00 WIB", start: "14:00", end: "15:00", period: "Siang" },
];

export default function KonsultasiPage() {
  const [consultationMethod, setConsultationMethod] = useState<"tatap-muka" | "zoom" | "chat">("tatap-muka");
  const [selectedSlot, setSelectedSlot] = useState("slot-1");
  const [date, setDate] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    institution: "",
    position: "",
    topic: "",
    participantCount: "1",
    umpegName: "",
    umpegPhone: "",
    notes: "",
    documentFileName: "",
  });

  const [createdResult, setCreatedResult] = useState<{
    consultationId: string;
  } | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot trap: jika input rahasia diisi bot, gagalkan secara senyap
    if (honeypot) {
      setCreatedResult({ consultationId: `KNS-${Date.now().toString(36).toUpperCase()}` });
      setShowSuccessPopup(true);
      return;
    }

    if (consultationMethod === "chat") {
      setCreatedResult({ consultationId: "CHAT" });
      setShowSuccessPopup(true);
      return;
    }

    const slot = TIME_SLOTS.find((s) => s.id === selectedSlot) || TIME_SLOTS[0];
    const targetDate = date || getMinDate();
    const formattedNotes = `Umum Kepegawaian:\nNama: ${formData.umpegName || "-"}\nNomor: ${formData.umpegPhone || "-"}\n\nCatatan:\n${formData.notes}`;

    setIsSubmitting(true);
    try {
      // 1. Simpan langsung ke Supabase melalui REST API
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          whatsapp: formData.whatsapp,
          email: formData.email,
          institution: formData.institution,
          position: formData.position,
          topic: formData.topic || "Konsultasi Umum JF",
          notes: formattedNotes,
          consultationMethod: consultationMethod === "zoom" ? "zoom" : "tatap-muka",
          estimatedDate: targetDate,
          estimatedTime: slot.label,
          website_url: honeypot,
        }),
      });

      const json = await res.json();
      const serverId = json.data?.id || `KNS-${Date.now().toString(36).toUpperCase()}`;

      // 2. Sinkronkan ke ConsultationStore
      ConsultationStore.addConsultation({
        name: formData.name,
        whatsapp: formData.whatsapp,
        email: formData.email,
        institution: formData.institution,
        position: formData.position,
        topic: formData.topic || "Konsultasi Umum JF",
        notes: formattedNotes,
        method: consultationMethod === "zoom" ? "zoom" : "tatap-muka",
        documentFileName: formData.documentFileName || undefined,
        estimatedDate: targetDate,
        estimatedTime: slot.label,
      });

      setCreatedResult({
        consultationId: serverId,
      });
      setShowSuccessPopup(true);
    } catch (err) {
      console.error("Gagal mengirim konsultasi ke server:", err);
      // Fallback lokal jika jaringan offline
      const result = ConsultationStore.addConsultation({
        name: formData.name,
        whatsapp: formData.whatsapp,
        email: formData.email,
        institution: formData.institution,
        position: formData.position,
        topic: formData.topic || "Konsultasi Umum JF",
        notes: formattedNotes,
        method: consultationMethod === "zoom" ? "zoom" : "tatap-muka",
        documentFileName: formData.documentFileName || undefined,
        estimatedDate: targetDate,
        estimatedTime: slot.label,
      });
      setCreatedResult({
        consultationId: result.id,
      });
      setShowSuccessPopup(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCreatedResult(null);
    setShowSuccessPopup(false);
    setHoneypot("");
    setFormData({
      name: "",
      email: "",
      whatsapp: "",
      institution: "",
      position: "",
      topic: "",
      participantCount: "1",
      umpegName: "",
      umpegPhone: "",
      notes: "",
      documentFileName: "",
    });
  };

  return (
    <PageTransition>
      <div className="w-full">
        <PageHeader
          title="Layanan Konsultasi"
          description="Ajukan permohonan konsultasi Jabatan Fungsional secara daring maupun luring. Tim kami akan segera menindaklanjuti permintaan Anda."
          breadcrumbs={[
            { label: "Beranda", href: "/" },
            { label: "Layanan" },
            { label: "Konsultasi", href: "/layanan/konsultasi" },
          ]}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* FORM AREA */}
            <div className="lg:col-span-8">
              <Card className="p-8 border border-slate-200 bg-white shadow-sm rounded-2xl">
                {createdResult ? (
                  /* HASIL SETELAH KIRIM PENGAJUAN */
                  <div className="py-6 text-center max-w-lg mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-5 text-emerald-600 shadow-sm">
                      <CheckCircle className="w-9 h-9" />
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 mb-2 border border-emerald-200">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Pengajuan Berhasil Dikirim
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900 mt-1">Permohonan Anda Telah Diterima</h2>

                    {createdResult?.consultationId === "CHAT" ? (
                      <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                        Silakan hubungi WhatsApp Helpdesk JF BNPB di <strong className="text-emerald-700">0812-3456-7890</strong> untuk konsultasi langsung.
                      </p>
                    ) : (
                      <>
                        <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                          Nomor tiket pengajuan Anda:
                        </p>
                        <div className="my-4 inline-block bg-slate-50 border border-slate-200 rounded-xl px-6 py-3">
                          <span className="font-mono font-bold text-[#005BAA] text-xl tracking-widest">{createdResult?.consultationId}</span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed">
                          Tim kami akan memproses pengajuan Anda dan menghubungi melalui <strong>WhatsApp</strong> atau <strong>Email</strong> untuk konfirmasi jadwal.
                          Pengajuan baru hanya dapat dilakukan setelah admin memberikan tindakan.
                        </p>
                      </>
                    )}

                    <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 text-left">
                      <p className="font-bold mb-1">📋 Apa yang terjadi selanjutnya?</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Admin BNPB menerima dan meninjau pengajuan Anda</li>
                        <li>Admin menetapkan jadwal konsultasi resmi</li>
                        <li>Anda akan dihubungi via email/WhatsApp dengan detail jadwal</li>
                      </ol>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <FileText className="w-5 h-5 text-[#005BAA]" />
                        <h2 className="text-xl font-bold text-slate-900">Formulir Pengajuan Konsultasi</h2>
                      </div>
                      <p className="text-sm text-slate-500">
                        Isi identitas Anda dan rincian masalah yang ingin dikonsultasikan.
                      </p>
                    </div>

                    <form className="space-y-8" onSubmit={handleSubmit}>
                      {/* Honeypot field perlindungan bot */}
                      <div className="hidden" aria-hidden="true" style={{ display: "none" }}>
                        <input
                          type="text"
                          name="website_url"
                          value={honeypot}
                          onChange={(e) => setHoneypot(e.target.value)}
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </div>

                      {/* STEP 1: METODE KONSULTASI */}
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                          <span>1. Pilih Metode Konsultasi</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={consultationMethod}
                          onChange={(e) => setConsultationMethod(e.target.value as any)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none bg-white text-sm text-slate-700"
                        >
                          <option value="tatap-muka">Tatap Muka (Gedung Graha BNPB Lt. 8)</option>
                          <option value="zoom">Zoom Meeting (Daring / Tatap Layar Virtual)</option>
                          <option value="chat">Chat WhatsApp (Tanya Langsung Cepat)</option>
                        </select>
                      </div>

                      {/* STEP 2: USULAN WAKTU KONSULTASI */}
                      {consultationMethod !== "chat" && (
                        <div className="bg-gradient-to-br from-blue-50/70 via-slate-50 to-orange-50/30 p-6 rounded-2xl border border-blue-100/80 space-y-5">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-[#005BAA]" />
                              <span>2. Usulan Waktu Konsultasi</span>
                              <span className="text-red-500">*</span>
                            </label>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-700">Estimasi Tanggal</label>
                              <div className="relative">
                                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                  type="date"
                                  required
                                  min={getMinDate()}
                                  value={date}
                                  onChange={(e) => setDate(e.target.value)}
                                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm bg-white"
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-700">Sesi Jam yang Diharapkan</label>
                              <div className="grid grid-cols-2 gap-2">
                                {TIME_SLOTS.map((slot) => (
                                  <button
                                    key={slot.id}
                                    type="button"
                                    onClick={() => setSelectedSlot(slot.id)}
                                    className={`py-2 px-2.5 rounded-lg border text-xs font-medium text-center transition-all ${selectedSlot === slot.id
                                      ? "border-[#005BAA] bg-[#005BAA] text-white shadow-sm font-semibold"
                                      : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                                      }`}
                                  >
                                    {slot.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* STEP 3: IDENTITAS PEMOHON */}
                      <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                          <span>{consultationMethod === "chat" ? "2" : "3"}. Data Identitas & Instansi</span>
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700">
                              Nama Lengkap & Gelar <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm"
                                placeholder="Contoh: Drs. Hendra Wijaya, M.Si"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700">
                              Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <input
                                type="tel"
                                required
                                value={formData.whatsapp}
                                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm"
                                placeholder="08123456789"
                              />
                            </div>
                          </div>
                        </div>

                        {consultationMethod !== "chat" && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-700">
                                Alamat Email Dinas / Pribadi <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                  type="email"
                                  required
                                  value={formData.email}
                                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm"
                                  placeholder="nama@instansi.go.id"
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-700">
                                Topik Konsultasi <span className="text-red-500">*</span>
                              </label>
                              <select
                                required
                                value={formData.topic}
                                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none bg-white text-sm text-slate-700"
                              >
                                {topics.map((t) => (
                                  <option key={t.value} value={t.value} disabled={t.value === ""}>
                                    {t.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700">
                              Instansi / Pemerintah Daerah <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <input
                                type="text"
                                required
                                value={formData.institution}
                                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm"
                                placeholder="Contoh: BPBD Provinsi Jawa Tengah"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700">
                              Jabatan Saat Ini <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <input
                                type="text"
                                required
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm"
                                placeholder="Contoh: Penata PB Ahli Muda"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700">
                              Nama Pejabat Umum Kepegawaian (Umpeg)
                            </label>
                            <div className="relative">
                              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <input
                                type="text"
                                value={formData.umpegName}
                                onChange={(e) => setFormData({ ...formData, umpegName: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm"
                                placeholder="Nama Pejabat Umpeg"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700">
                              Nomor WhatsApp Umpeg
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <input
                                type="tel"
                                value={formData.umpegPhone}
                                onChange={(e) => setFormData({ ...formData, umpegPhone: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm"
                                placeholder="0812..."
                              />
                            </div>
                          </div>
                        </div>

                        {consultationMethod !== "chat" && (
                          <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                              <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">
                                  Estimasi Jumlah Orang Konsultasi
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  value={formData.participantCount}
                                  onChange={(e) => setFormData({ ...formData, participantCount: e.target.value })}
                                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm"
                                  placeholder="1"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">
                                  Surat Pengantar Dinas <span className="text-slate-400 font-normal">(opsional, max 2MB, PDF)</span>
                                </label>
                                <div className="relative">
                                  <input
                                    type="file"
                                    accept=".pdf,application/pdf"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        if (file.size > 2 * 1024 * 1024) {
                                          alert("Ukuran file maksimal 2 MB.");
                                          e.target.value = "";
                                          return;
                                        }
                                        if (file.type !== "application/pdf") {
                                          alert("Hanya file PDF yang diperbolehkan.");
                                          e.target.value = "";
                                          return;
                                        }
                                        setFormData({ ...formData, documentFileName: file.name });
                                      }
                                    }}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-xs bg-white file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#005BAA]/10 file:text-[#005BAA]"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-700">
                                Pokok Permasalahan / Catatan Pertanyaan <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <MessageSquare className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                                <textarea
                                  required
                                  rows={4}
                                  value={formData.notes}
                                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#005BAA]/20 focus:border-[#005BAA] outline-none text-sm resize-none"
                                  placeholder="Uraikan poin permasalahan atau pertanyaan yang ingin dikonsultasikan secara spesifik..."
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* SUBMIT BUTTON */}
                      <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-xs text-slate-500 flex items-center gap-1.5">
                          <CheckCircle className="w-4 h-4 text-[#005BAA]" />
                          <span>Pengajuan akan masuk ke antrean admin BNPB.</span>
                        </div>
                        <button
                          type="submit"
                          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-[#005BAA] hover:bg-[#003F7D] text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                          <Send className="w-4 h-4" />
                          {consultationMethod === "chat" ? "Buka Chat WhatsApp" : "Kirim Pengajuan"}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </Card>
            </div>

            {/* SIDEBAR INFO */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="p-6 border border-slate-200 bg-white shadow-sm rounded-2xl">
                <h3 className="text-base font-bold text-slate-900 mb-4">Informasi Kontak Layanan</h3>
                <ul className="space-y-4 text-sm text-slate-600">
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#F7941D] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      Gedung Graha BNPB Lt. 8, Jl. Pramuka No. 38, Matraman, Jakarta Timur 13120
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#F7941D] shrink-0" />
                    <span>085111380175 / 117</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#F7941D] shrink-0" />
                    <span>PusbinJFKebencanaan@bnpb.go.id</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6 bg-[#005BAA] text-white border-none shadow-md rounded-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-[#F7941D]" />
                  <h3 className="text-base font-bold text-white">Jam Operasional Layanan</h3>
                </div>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-200">Senin – Kamis</span>
                    <span className="font-bold text-white">08.00 – 16.00 WIB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Jumat</span>
                    <span className="font-bold text-white">08.00 – 16.30 WIB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Sabtu – Minggu</span>
                    <span className="font-bold text-blue-300">Libur</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border border-slate-200 bg-slate-50 rounded-2xl">
                <h3 className="text-base font-bold text-slate-900 mb-3">Topik Sering Dikonsultasikan</h3>
                <ul className="space-y-2.5 text-sm">
                  {[
                    "Persyaratan UKOM Kenaikan Jenjang",
                    "Penetapan Angka Kredit (PAK) Integrasi & Konversi",
                    "Pengangkatan Pertama / Inpassing JF PB",
                    "Klarifikasi Rekomendasi Teknis Kebencanaan",
                  ].map((q, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700">
                      <span className="text-[#005BAA] font-bold shrink-0">•</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* POP UP MODAL NOTIFIKASI SUKSES SETELAH KIRIM                 */}
        {/* ============================================================ */}
        {showSuccessPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop dengan efek blur */}
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
              onClick={() => setShowSuccessPopup(false)}
            />

            {/* Kotak Dialog Pop Up */}
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-8 text-center z-10 animate-in zoom-in-95 duration-200">
              {/* Tombol Tutup X di pojok kanan atas */}
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Tutup notifikasi"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Ikon Sukses */}
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm ring-8 ring-emerald-50">
                <CheckCircle className="w-8 h-8" />
              </div>

              {/* Judul & Pesan Sesuai Permintaan User */}
              <h3 className="text-xl font-bold text-slate-900">
                Pesan Anda Sudah Terkirim
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed mt-2.5">
                Mohon untuk cek berkala pada email Anda <span className="font-bold text-slate-900">1 x 24 jam</span> untuk menerima konfirmasi jadwal dan tautan resmi dari tim pembina JF BNPB.
              </p>

              {/* Kotak Nomor Tiket */}
              {createdResult?.consultationId && createdResult.consultationId !== "CHAT" && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 my-4 text-xs text-slate-600">
                  <span className="text-slate-400 block text-[11px] font-medium mb-0.5 uppercase tracking-wide">
                    Nomor Tiket Pengajuan:
                  </span>
                  <span className="font-mono font-bold text-[#005BAA] text-lg tracking-wider">
                    {createdResult.consultationId}
                  </span>
                  {formData.email && (
                    <span className="block text-slate-500 mt-1 truncate">
                      Pemberitahuan akan dikirim ke: <strong className="text-slate-700">{formData.email}</strong>
                    </span>
                  )}
                </div>
              )}

              {/* Tombol Konfirmasi */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowSuccessPopup(false)}
                  className="w-full py-3 px-5 rounded-xl font-bold text-sm text-white bg-[#005BAA] hover:bg-[#003F7D] active:scale-[0.98] transition-all shadow-md shadow-blue-900/10 cursor-pointer"
                >
                  Saya Mengerti
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
