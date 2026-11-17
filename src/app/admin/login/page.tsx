import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminLoginPage } from "./LoginPage";

const VALID_KEY = process.env.ADMIN_SECRET_KEY || process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || "bnpb2026";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const key = typeof params.key === "string" ? params.key : "";

  if (key !== VALID_KEY) {
    return {
      title: "404 - Halaman Tidak Ditemukan",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: "Login Administrator | JF BNPB",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const key = typeof params.key === "string" ? params.key : "";

  // Jika kunci rahasia tidak cocok, lempar HTTP 404 asli dari server
  if (key !== VALID_KEY) {
    notFound();
  }

  return <AdminLoginPage />;
}
