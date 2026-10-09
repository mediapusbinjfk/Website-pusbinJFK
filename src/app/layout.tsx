import type { Metadata } from "next";
import "./globals.css";
import { AppLayout } from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "Unit Pengelola Jabatan Fungsional | Badan Nasional Penanggulangan Bencana",
  description:
    "Portal resmi Unit Pengelola Jabatan Fungsional Penata Penanggulangan Bencana - BNPB. Mendukung pelaksanaan tugas dan pengelolaan informasi secara profesional, terstruktur, dan terintegrasi.",
  keywords: [
    "BNPB",
    "Jabatan Fungsional",
    "Penata Penanggulangan Bencana",
    "Uji Kompetensi",
    "Angka Kredit",
    "Bimbingan Teknis",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900 overflow-x-hidden w-full max-w-full">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}

