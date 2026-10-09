"use client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Wrench } from "lucide-react";
export default function Page() {
  return (
    <AdminLayout>
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
          <Wrench className="w-8 h-8 text-[#005BAA]" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Template WhatsApp</h2>
        <p className="text-slate-500 text-sm max-w-sm">Halaman ini sedang dalam pengembangan. Akan segera tersedia.</p>
      </div>
    </AdminLayout>
  );
}
