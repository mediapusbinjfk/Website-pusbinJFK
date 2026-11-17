import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/components/layout/AppLayout";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://pusbinjf.bnpb.go.id"),
  title: {
    default: "Pusat Pembinaan Jabatan Fungsional Kebencanaan | BNPB",
    template: "%s | Pusbin JF BNPB",
  },
  description:
    "Portal resmi Pusat Pembinaan Jabatan Fungsional Kebencanaan — Badan Nasional Penanggulangan Bencana. Pembinaan karir, regulasi, uji kompetensi, dan standardisasi aparatur penanggulangan bencana di Indonesia.",
  keywords: [
    "BNPB",
    "Jabatan Fungsional",
    "Penata Penanggulangan Bencana",
    "Uji Kompetensi",
    "Angka Kredit",
    "Bimbingan Teknis",
    "Regulasi Kebencanaan",
  ],
  authors: [{ name: "BNPB Indonesia", url: "https://www.bnpb.go.id" }],
  creator: "Badan Nasional Penanggulangan Bencana",
  publisher: "Pusat Pembinaan Jabatan Fungsional Kebencanaan BNPB",
  openGraph: {
    title: "Pusat Pembinaan Jabatan Fungsional Kebencanaan | BNPB",
    description: "Portal resmi pembinaan karir, regulasi, dan standardisasi aparatur penanggulangan bencana di Indonesia.",
    url: "https://pusbinjf.bnpb.go.id",
    siteName: "Pusbin JF BNPB",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/images/hero-bnpb.png",
        width: 1200,
        height: 630,
        alt: "Gedung Graha BNPB Jakarta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pusat Pembinaan Jabatan Fungsional Kebencanaan | BNPB",
    description: "Portal resmi pembinaan karir, regulasi, dan standardisasi aparatur penanggulangan bencana di Indonesia.",
    images: ["/images/hero-bnpb.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`h-full scroll-smooth ${plusJakartaSans.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900 overflow-x-hidden w-full max-w-full">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}

