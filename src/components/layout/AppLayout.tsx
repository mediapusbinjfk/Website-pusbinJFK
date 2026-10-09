"use client";

import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FloatingChatWidget } from "@/components/features/chat/FloatingChatWidget";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // Portal Admin memiliki layout mandiri (AdminLayout & AdminSidebar/Topbar)
  // Hilangkan Navbar publik, Footer publik, dan FloatingChat di seluruh rute /admin
  if (isAdmin) {
    return <>{children}</>;
  }

  // Navbar is fixed, so inner pages need padding equal to navbar height (desktop ~104px, mobile ~80px)
  const isHome = pathname === "/";

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 w-full max-w-full overflow-x-clip">
      <Navbar />
      <main className={cn("flex-1 w-full max-w-full overflow-x-clip", !isHome && "pt-[80px] lg:pt-[104px]")}>
        {children}
      </main>
      <Footer />
      <FloatingChatWidget />
    </div>
  );
};
