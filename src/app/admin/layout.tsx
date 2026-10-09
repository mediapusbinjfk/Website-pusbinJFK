import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal Admin | JF BNPB",
  description: "Portal Admin Jabatan Fungsional BNPB",
  robots: "noindex, nofollow",
};

// Admin layout — tidak menggunakan AppLayout publik (Navbar/Footer/FloatingChat dihilangkan).
// Halaman /admin/login memiliki layoutnya sendiri dan TIDAK menggunakan AdminLayout (sidebar/topbar).
// Halaman admin lainnya merender AdminLayout melalui component mereka masing-masing.
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Kita biarkan setiap halaman memilih sendiri apakah pakai AdminLayout atau tidak.
  // Halaman /admin/login merender tanpa sidebar.
  // Halaman lainnya menggunakan AdminLayoutWrapper yang sudah dihandle di page.tsx masing-masing.
  return <>{children}</>;
}
