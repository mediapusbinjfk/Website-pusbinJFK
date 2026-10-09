"use client";

import React, { useState } from "react";
import { Headset, X, Send, User, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const FloatingChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "admin",
      text: "Halo! Saya Budi, Admin Helpdesk JF BNPB. Ada yang bisa saya bantu hari ini?",
      time: ""
    }
  ]);
  const [inputValue, setInputValue] = useState("");

  React.useEffect(() => {
    setIsMounted(true);
    setMessages([{
      id: 1,
      sender: "admin",
      text: "Halo! Saya Budi, Admin Helpdesk JF BNPB. Ada yang bisa saya bantu hari ini?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const newUserMsg = {
      id: messages.length + 1,
      sender: "user",
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");

    const userText = inputValue.toLowerCase();
    let replyText = "Terima kasih atas pesan Anda. pesan ini akan dijawab oleh staf Helpdesk Pusbin JF BNPB.";

    // Existing checks
    if (userText.includes("uji kompetensi") || userText.includes("ukom")) {
      replyText = "Untuk informasi pendaftaran dan jadwal Uji Kompetensi (UKOM) JF PB, Anda dapat memantaunya melalui pengumuman resmi di menu Informasi Publik, atau menghubungi tim pembina.";
    } else if (userText.includes("angka kredit") || userText.includes("dupak") || userText.includes("pak")) {
      replyText = "Terkait Penilaian Angka Kredit (PAK), format DUPAK dan petunjuk teknisnya dapat Anda unduh pada menu Layanan > Produk Hukum.";
    } else if (userText.includes("inpassing") || userText.includes("pengangkatan") || userText.includes("syarat")) {
      replyText = "Persyaratan Inpassing maupun Pengangkatan Pertama JF Penata Penanggulangan Bencana mengacu pada PermenPANRB terbaru. Anda bisa melihat dokumen lengkapnya di bagian Produk Hukum.";
    } else if (userText.includes("halo") || userText.includes("pagi") || userText.includes("siang") || userText.includes("sore") || userText.includes("malam")) {
      replyText = "Halo! Silakan sampaikan pertanyaan Anda seputar layanan Jabatan Fungsional BNPB.";
    }
    // New checks for website features
    else if (userText.includes("konsultasi") || userText.includes("bertanya") || userText.includes("bantuan")) {
      replyText = "Untuk melakukan konsultasi lebih detail, Anda dapat mengakses menu Layanan > Konsultasi. Di sana tersedia formulir yang bisa Anda isi, dan tim kami akan merespons melalui email dalam 1-2 hari kerja.";
    } else if (userText.includes("unduh") || userText.includes("download") || userText.includes("produk hukum") || userText.includes("peraturan") || userText.includes("dokumen")) {
      replyText = "Semua dokumen regulasi, peraturan, dan surat edaran dapat Anda temukan di menu Layanan > Produk Hukum. Anda bisa mencari dokumen yang spesifik dan langsung menekan tombol 'Unduh' yang tersedia di setiap daftar dokumen.";
    }

    // Simulate admin reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: "admin",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 800);
  };

  return (
    <>
      {/* CHAT WINDOW */}
      <div
        className={cn(
          "fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right",
          isOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
        )}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#005BAA] to-[#003F7D] p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Headset className="w-5 h-5 text-white" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#003F7D] rounded-full"></span>
            </div>
            <div>
              <div className="font-bold text-sm">Helpdesk JF BNPB</div>
              <div className="text-xs text-blue-200">Online</div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 h-64 bg-slate-50 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex w-full",
                msg.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                  msg.sender === "user"
                    ? "bg-[#005BAA] text-white rounded-br-sm"
                    : "bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm"
                )}
              >
                {msg.text}
                <div className={cn(
                  "text-[10px] mt-1 text-right",
                  msg.sender === "user" ? "text-blue-200" : "text-slate-400"
                )}>
                  {isMounted ? msg.time : ""}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Tulis pesan..."
            className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#005BAA]/30"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="w-9 h-9 rounded-full bg-[#F7941D] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E07B00] transition-colors shrink-0"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>

      {/* FLOATING BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#005BAA] hover:bg-[#003F7D] text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 group animate-float",
          isOpen ? "scale-0 opacity-0 invisible" : "scale-100 opacity-100 visible"
        )}
        aria-label="Tanya Admin"
      >
        <div className="relative">
          <Headset className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-[#005BAA] rounded-full animate-pulse shadow-sm"></span>
        </div>
      </button>
    </>
  );
};
