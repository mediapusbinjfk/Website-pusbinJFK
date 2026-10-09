import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Terjadi Kendala Memuat Data",
  description = "Data tidak dapat ditampilkan saat ini karena kendala teknis atau jaringan.",
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center bg-red-50/40 border border-red-200 rounded-xl my-6",
        className
      )}
    >
      <div className="p-4 bg-red-100 text-red-600 rounded-full mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-600 max-w-md mb-6">{description}</p>
      {onRetry && (
        <Button
          variant="primary"
          size="sm"
          onClick={onRetry}
          icon={<RefreshCw className="w-4 h-4" />}
        >
          Coba Lagi
        </Button>
      )}
    </div>
  );
};
