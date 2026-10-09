"use client";

import React, { createContext, useContext, useState, useCallback, useId } from "react";
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
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

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Fallback if rendered outside provider
    return {
      showToast: (message: string) => {
        if (typeof window !== "undefined") {
          console.log("[Toast fallback]:", message);
        }
      },
      removeToast: () => {},
      toasts: [],
    };
  }
  return ctx;
}

// ============================================================
// TOAST CONTAINER & ITEM COMPONENT
// ============================================================
export function ToastContainer({
  toasts,
  onClose,
}: {
  toasts: ToastItem[];
  onClose: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-2 sm:p-0"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onClose={() => onClose(toast.id)} />
      ))}
    </div>
  );
}

const TOAST_THEMES: Record<
  ToastType,
  {
    bg: string;
    border: string;
    text: string;
    icon: React.ReactNode;
    barBg: string;
  }
> = {
  success: {
    bg: "bg-white",
    border: "border-emerald-200",
    text: "text-slate-800",
    barBg: "bg-emerald-500",
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
  },
  error: {
    bg: "bg-white",
    border: "border-rose-200",
    text: "text-slate-800",
    barBg: "bg-rose-500",
    icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
  },
  warning: {
    bg: "bg-white",
    border: "border-amber-200",
    text: "text-slate-800",
    barBg: "bg-amber-500",
    icon: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
  },
  info: {
    bg: "bg-white",
    border: "border-blue-200",
    text: "text-slate-800",
    barBg: "bg-[#005BAA]",
    icon: <Info className="w-5 h-5 text-[#005BAA] shrink-0" />,
  },
};

function ToastCard({
  toast,
  onClose,
}: {
  toast: ToastItem;
  onClose: () => void;
}) {
  const theme = TOAST_THEMES[toast.type] || TOAST_THEMES.info;

  return (
    <div
      className={`pointer-events-auto w-full rounded-xl border ${theme.border} ${theme.bg} shadow-xl p-3.5 flex items-start gap-3 relative overflow-hidden transition-all duration-300 transform translate-y-0 opacity-100 animate-in fade-in slide-in-from-bottom-5`}
      role="alert"
    >
      {/* Accent strip */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${theme.barBg}`} />

      {/* Icon */}
      <div className="pl-1 pt-0.5">{theme.icon}</div>

      {/* Message Content */}
      <div className="flex-1 min-w-0 pr-2">
        {toast.title && (
          <h4 className="text-xs font-bold text-slate-800 tracking-tight leading-snug">
            {toast.title}
          </h4>
        )}
        <p className="text-xs font-medium text-slate-600 leading-relaxed mt-0.5 break-words">
          {toast.message}
        </p>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
        aria-label="Tutup Notifikasi"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
