import React from "react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  tag?: string;
  className?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  description,
  breadcrumbs,
  tag,
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden border-b border-[#D6E4F0] py-10 px-4 sm:px-6 lg:px-8",
        className
      )}
      style={{
        background: "linear-gradient(135deg, #044085 0%, #022d5c 60%, #0f1f3d 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#F7941D]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-96 h-24 rounded-full bg-[#044085]/30 blur-2xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb items={breadcrumbs} className="mb-5" />
        )}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-2">
            {tag && (
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#F7941D]/20 text-[#F7941D] border border-[#F7941D]/30 mb-1">
                {tag}
              </span>
            )}
            {/* Orange accent line */}
            <div className="h-[3px] w-12 rounded-full bg-gradient-to-r from-[#F7941D] to-[#044085]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
              {title}
            </h1>
            {(subtitle || description) && (
              <p className="text-sm sm:text-base text-blue-100/80 max-w-3xl leading-relaxed">
                {subtitle || description}
              </p>
            )}
          </div>

          {children && (
            <div className="flex items-center gap-3 shrink-0">{children}</div>
          )}
        </div>
      </div>
    </div>
  );
};
