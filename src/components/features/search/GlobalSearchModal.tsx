"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, X, FileText, Newspaper, Users, Briefcase, Calendar, ChevronRight, CornerDownLeft } from "lucide-react";
import { globalSearch } from "@/lib/searchService";
import { SearchResultItem } from "@/types";
import { Badge } from "@/components/ui/Badge";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState("");
  const results = React.useMemo(() => {
    return query.trim().length >= 2 ? globalSearch(query) : [];
  }, [query]);

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open via parent
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = (type: SearchResultItem["type"]) => {
    switch (type) {
      case "berita":
        return <Newspaper className="w-4 h-4 text-blue-600" />;
      case "dokumen":
        return <FileText className="w-4 h-4 text-red-600" />;
      case "sdm":
        return <Users className="w-4 h-4 text-emerald-600" />;
      case "program":
        return <Briefcase className="w-4 h-4 text-amber-600" />;
      case "kegiatan":
        return <Calendar className="w-4 h-4 text-purple-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Search Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 bg-slate-50/50">
          <Search className="w-5 h-5 text-[#005BAA] shrink-0 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari regulasi, layanan konsultasi, SOP, publikasi, atau menu portal..."
            autoFocus
            className="w-full bg-transparent border-none text-slate-800 placeholder-slate-400 text-sm sm:text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-200 rounded"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {query.trim().length < 2 ? (
            <div className="py-8 px-4 text-center">
              <p className="text-xs text-slate-400 mb-3">
                Ketik minimal 2 karakter untuk memulai pencarian di seluruh pangkalan data.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {["Uji Kompetensi", "SOP Angka Kredit", "Ahli Madya", "Bimtek", "Rakornas"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">
              Tidak ada hasil yang cocok dengan kata kunci &quot;<span className="font-semibold text-slate-700">{query}</span>&quot;.
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">
                Ditemukan {results.length} Hasil
              </div>
              {results.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  onClick={onClose}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-red-50/50 hover:border-red-100 border border-transparent transition-all group"
                >
                  <div className="p-2 rounded-md bg-slate-100 group-hover:bg-white group-hover:shadow-xs transition-all shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-slate-800 group-hover:text-[#C8102E] truncate">
                        {item.title}
                      </span>
                      <Badge variant="neutral" size="sm" className="text-[10px] shrink-0">
                        {item.category}
                      </Badge>
                    </div>
                    {item.description && (
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#C8102E] shrink-0 self-center" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Pencarian Instan Repositori JF BNPB</span>
          <span className="flex items-center gap-1">
            Tekan <CornerDownLeft className="w-3 h-3" /> untuk memilih
          </span>
        </div>
      </div>
    </div>
  );
};
