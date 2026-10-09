import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "primary" | "secondary" | "info" | "success" | "warning" | "danger" | "neutral";
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  primary: "bg-[#FFF7ED] text-[#E07B00] border-[#F7941D]/30",
  secondary: "bg-[#E6F0FA] text-[#005BAA] border-[#005BAA]/20",
  info: "bg-blue-50 text-blue-700 border-blue-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-red-50 text-[#C8102E] border-red-200",
  neutral: "bg-slate-100 text-slate-600 border-slate-200",
};

const sizeStyles: Record<string, string> = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
};

export const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  size = "sm",
  className,
  children,
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center font-bold rounded-md border whitespace-nowrap tracking-wide uppercase",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
};
