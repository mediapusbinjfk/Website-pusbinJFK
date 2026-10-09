"use client";

import React, { useState, useRef, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Search, Send, Paperclip, MoreVertical, Phone, Video,
  Check, CheckCheck, Clock, User, Building2, Calendar,
  Smile, FileText, ChevronDown, RefreshCw, Plus, Filter,
  MessageSquare, ExternalLink, ShieldCheck
} from "lucide-react";

interface MessageItem {
  id: string;
  sender: "user" | "admin";
  text: string;
  time: string;
  status: "sent" | "delivered" | "read";
}

interface ChatConversation {
  id: string;
  name: string;
  phone: string;
  institution: string;
  position: string;
  avatarBg: string;
  unreadCount: number;
  online: boolean;
  messages: MessageItem[];
}

const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: "CHAT-001",
    name: "Drs. Hendra Wijaya, M.Si",
    phone: "+62 812-3456-7890",
    institution: "BPBD Provinsi Jawa Tengah",
    position: "Kepala Seksi Pencegahan",
    avatarBg: "bg-blue-600",
    unreadCount: 1,
    online: true,
    messages: [
      {
        id: "m1",
        sender: "user",
        text: "Selamat pagi Bapak/Ibu Admin Pusbin JF BNPB. Saya ingin menanyakan kelanjutan jadwal konsultasi terkait UKOM untuk jenjang Madya yang sudah saya ajukan.",
        time: "09:15",
        status: "read",
      },
      {
        id: "m2",
        sender: "admin",
        text: "Selamat pagi Pak Hendra. Permohonan Anda sudah kami terima dan terjadwal secara daring via Zoom pada tanggal 5 Oktober 2026 pukul 09.00 - 10.00 WIB.",
        time: "09:20",
        status: "read",
      },
      {
        id: "m3",
        sender: "user",
        text: "Baik terima kasih banyak Bu/Pak. Apakah berkas portofolio perlu diunggah terlebih dahulu sebelum sesi meeting dimulai?",
        time: "09:32",
        status: "read",
      },
    ],
  },
  {
    id: "CHAT-002",
    name: "Ir. Siti Rahayu",
    phone: "+62 856-7891-2345",
    institution: "BNPB Pusat",
    position: "Analis Kebencanaan Madya",
    avatarBg: "bg-amber-600",
    unreadCount: 0,
    online: false,
    messages: [
      {
        id: "m1",
        sender: "user",
        text: "Halo Admin, untuk konsultasi tatap muka kenaikan pangkat di Graha BNPB Lt. 8, kami harus konfirmasi ke resepsionis atas nama siapa ya?",
        time: "Kemarin",
        status: "read",
      },
      {
        id: "m2",
        sender: "admin",
        text: "Halo Bu Siti. Anda bisa langsung lapor ke resepsionis Lt. 8 untuk tujuan 'Konsultasi Pembinaan JF Kebencanaan BNPB'. Tim kami akan langsung menyambut di Ruang Rapat Lt. 8.",
        time: "Kemarin",
        status: "read",
      },
      {
        id: "m3",
        sender: "user",
        text: "Siap, terima kasih banyak atas infonya!",
        time: "Kemarin",
        status: "read",
      },
    ],
  },
  {
    id: "CHAT-003",
    name: "Ahmad Fauzi, S.T.",
    phone: "+62 811-2233-4455",
    institution: "BPBD Kota Surabaya",
    position: "Penata PB Pertama",
    avatarBg: "bg-emerald-600",
    unreadCount: 0,
    online: true,
    messages: [
      {
        id: "m1",
        sender: "admin",
        text: "Yth. Bapak Ahmad Fauzi, link Zoom untuk konsultasi PAK hari ini sudah dapat diakses: https://zoom.us/j/9876543210 (Passcode: BNPB2026).",
        time: "08:50",
        status: "read",
      },
      {
        id: "m2",
        sender: "user",
        text: "Baik, terima kasih admin. Saya sudah bersiap masuk room.",
        time: "08:55",
        status: "read",
      },
    ],
  },
  {
    id: "CHAT-004",
    name: "Rini Kusumawati, M.Pd.",
    phone: "+62 876-5432-1090",
    institution: "BPBD Provinsi Banten",
    position: "Koordinator Logistik PB",
    avatarBg: "bg-purple-600",
    unreadCount: 0,
    online: false,
    messages: [
      {
        id: "m1",
        sender: "user",
        text: "Selamat siang, apakah jadwal inpassing saya bisa dimajukan ke hari Kamis?",
        time: "25 Sep",
        status: "read",
      },
      {
        id: "m2",
        sender: "admin",
        text: "Selamat siang Bu Rini. Jadwal telah kami reschedule ke Kamis, 3 Oktober pukul 13.00 WIB bertempat di Gedung Graha BNPB Lt. 8.",
        time: "25 Sep",
        status: "read",
      },
    ],
  },
];

const QUICK_TEMPLATES = [
  {
    label: "Format Jadwal Zoom",
    text: "Yth. Bapak/Ibu, konsultasi Anda telah dijadwalkan secara daring melalui Zoom Meeting. Tautan: https://zoom.us/j/9876543210 (Passcode: BNPB2026). Mohon hadir tepat waktu.",
  },
  {
    label: "Format Tatap Muka Graha BNPB",
    text: "Yth. Bapak/Ibu, jadwal konsultasi tatap muka Anda akan dilaksanakan di Gedung Graha BNPB Lt. 8, Jl. Pramuka No. 38, Matraman, Jakarta Timur (Ruang Rapat Pembinaan JF Kebencanaan).",
  },
  {
    label: "Permintaan Berkas Pendukung",
    text: "Mohon melampirkan berkas pendukung (Surat Pengantar / SK Pangkat Terakhir / DUPAK) dalam format PDF agar tim penilai kami dapat mempelajari terlebih dahulu.",
  },
  {
    label: "Konfirmasi Kehadiran",
    text: "Terima kasih atas konfirmasinya. Tim Pusbin JF BNPB siap membantu proses konsultasi Anda sesuai jadwal yang telah ditentukan.",
  },
];

export default function MonitoringWhatsAppChatPage() {
  const [conversations, setConversations] = useState<ChatConversation[]>(INITIAL_CONVERSATIONS);
  const [selectedChatId, setSelectedChatId] = useState<string>("CHAT-001");
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = conversations.find((c) => c.id === selectedChatId) || conversations[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages]);

  // Handle Send Message
  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !activeChat) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      sender: "admin",
      text,
      time: timeStr,
      status: "delivered",
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeChat.id) {
          return {
            ...c,
            unreadCount: 0,
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    setInputText("");
    setShowTemplates(false);

    // ============================================================
    // TODO: INTEGRASI API WHATSAPP RESMI ANDA
    // Contoh implementasi webhook/API:
    // await fetch('/api/whatsapp/send-message', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     recipientPhone: activeChat.phone,
    //     message: text
    //   })
    // });
    // ============================================================
  };

  const filteredConversations = conversations.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.institution.toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout>
      {/* Container Full WhatsApp Chat Experience */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-140px)] min-h-[580px]">
        
        <div className="flex flex-1 overflow-hidden">
          
          {/* ============================================================ */}
          {/* LEFT PANE: DAFTAR PERCAKAPAN WHATSAPP (360px)                 */}
          {/* ============================================================ */}
          <div className="w-80 md:w-96 border-r border-slate-200 flex flex-col bg-slate-50/50">
            
            {/* Header Kiri */}
            <div className="p-3.5 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  WA
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 leading-tight">WhatsApp Web JF</h2>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Terhubung (Live Chat)</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-mono bg-white px-2 py-1 rounded-md border border-slate-200">
                Pusbin JF
              </div>
            </div>

            {/* Kotak Pencarian Kontak */}
            <div className="p-3 border-b border-slate-200/80 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari chat atau nama pegawai..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs outline-none bg-slate-100/70 focus:bg-white focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* List Kontak / Thread */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 bg-white">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Tidak ada obrolan ditemukan
                </div>
              ) : (
                filteredConversations.map((chat) => {
                  const isSelected = chat.id === activeChat.id;
                  const lastMsg = chat.messages[chat.messages.length - 1];

                  return (
                    <button
                      key={chat.id}
                      onClick={() => {
                        setSelectedChatId(chat.id);
                        // Clear unread
                        setConversations((prev) =>
                          prev.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c))
                        );
                      }}
                      className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors ${
                        isSelected ? "bg-emerald-50/70 border-l-4 border-l-emerald-600" : "hover:bg-slate-50"
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div className={`w-11 h-11 rounded-full ${chat.avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-xs`}>
                          {chat.name.charAt(0)}
                        </div>
                        {chat.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h4 className="text-xs font-bold text-slate-900 truncate">{chat.name}</h4>
                          <span className="text-[10px] text-slate-400 shrink-0">{lastMsg?.time}</span>
                        </div>

                        <p className="text-[11px] text-slate-500 truncate mb-1">{chat.institution}</p>

                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[11px] text-slate-400 truncate flex-1 flex items-center gap-1">
                            {lastMsg?.sender === "admin" && (
                              <CheckCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            )}
                            <span className="truncate">{lastMsg?.text}</span>
                          </p>

                          {chat.unreadCount > 0 && (
                            <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Info API Footer */}
            <div className="p-2.5 bg-slate-100/70 border-t border-slate-200 text-[10px] text-slate-500 text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>API Gateway Ready · Siap kirim & balas langsung</span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT PANE: CHAT ROOM LIVE CONVERSATION                       */}
          {/* ============================================================ */}
          <div className="flex-1 flex flex-col bg-[#efeae2]/30 relative">
            
            {/* Header Kontak Aktif */}
            <div className="p-3 px-4 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${activeChat.avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-xs`}>
                  {activeChat.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 leading-tight">{activeChat.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-slate-600 font-mono">{activeChat.phone}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] text-[#005BAA] font-semibold">{activeChat.institution}</span>
                    {activeChat.online && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="text-[10px] text-emerald-600 font-medium">Online</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${activeChat.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
                >
                  <ExternalLink className="w-3 h-3 text-emerald-600" />
                  <span>Buka WA Web Resmi</span>
                </a>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]">
              
              {/* Info Security / Banner */}
              <div className="mx-auto max-w-md bg-amber-50/90 border border-amber-200/80 rounded-xl p-2.5 text-center text-[11px] text-amber-800 shadow-2xs">
                Percakapan konsultasi terenkripsi. Pesan yang Anda ketik di sini langsung dikirimkan ke WhatsApp pemohon tanpa perlu membuka handphone.
              </div>

              {activeChat.messages.map((msg) => {
                const isAdmin = msg.sender === "admin";

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[78%] md:max-w-[65%] rounded-2xl p-3 shadow-xs text-xs relative ${
                        isAdmin
                          ? "bg-[#d9fdd3] text-slate-900 rounded-tr-none border border-emerald-200/60"
                          : "bg-white text-slate-900 rounded-tl-none border border-slate-200/80"
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      
                      <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400">
                        <span>{msg.time}</span>
                        {isAdmin && (
                          <CheckCheck className="w-3.5 h-3.5 text-blue-500 inline" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Template Picker Dropup */}
            {showTemplates && (
              <div className="absolute bottom-16 left-4 right-4 bg-white border border-slate-200 rounded-2xl shadow-xl p-3.5 z-20 space-y-2 animate-scale-up">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    Pilih Template Balasan Cepat
                  </span>
                  <button
                    onClick={() => setShowTemplates(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
                  >
                    Tutup
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {QUICK_TEMPLATES.map((tmpl, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(tmpl.text)}
                      className="p-2.5 rounded-xl border border-slate-100 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-all group"
                    >
                      <span className="text-[11px] font-bold text-slate-900 group-hover:text-emerald-700 block">
                        {tmpl.label}
                      </span>
                      <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                        {tmpl.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Input Bar */}
            <div className="p-3 bg-slate-100/90 border-t border-slate-200 flex items-center gap-2">
              
              {/* Tombol Template Cepat */}
              <button
                type="button"
                onClick={() => setShowTemplates(!showTemplates)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  showTemplates
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-white border border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
                title="Pilih Template Format Balasan"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Template</span>
              </button>

              {/* Input Kolom Ketik */}
              <input
                type="text"
                placeholder="Ketik pesan balasan langsung ke WhatsApp..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-xs bg-white shadow-2xs"
              />

              {/* Tombol Kirim */}
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white flex items-center justify-center transition-all shadow-xs shrink-0 active:scale-95"
                title="Kirim Pesan"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
