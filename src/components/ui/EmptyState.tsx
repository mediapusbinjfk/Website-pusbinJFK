import React from "react";
import { FolderSearch } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Belum Ada Data Tersedia",
  description = "Tidak ditemukan data yang sesuai dengan kriteria pencarian atau filter yang Anda pilih.",
  actionText,
  onAction,
  icon,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center bg-white border border-dashed border-slate-300 rounded-xl my-6",
        className
      )}
    >
      <div className="p-4 bg-red-50 text-[#C8102E] rounded-full mb-4">
        {icon || <FolderSearch className="w-8 h-8 stroke-[1.5]" />}
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-6">{description}</p>
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
