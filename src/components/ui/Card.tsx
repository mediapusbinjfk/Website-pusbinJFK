import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverable = false,
  noPadding = false,
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-slate-200/80",
        "shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)]",
        hoverable && [
          "transition-all duration-300 cursor-pointer",
          "hover:shadow-[0_12px_24px_-4px_rgba(0,91,170,0.08),0_4px_8px_-2px_rgba(0,0,0,0.04)]",
          "hover:border-[#F7941D]/50",
          "hover:-translate-y-1",
        ],
        !noPadding && "p-5",
        className
      )}
    >
      {children}
    </div>
  );
};
