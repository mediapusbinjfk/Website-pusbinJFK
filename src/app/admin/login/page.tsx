import type { Metadata } from "next";
import { AdminLoginPage } from "./LoginPage";

export const metadata: Metadata = {
  title: "Login Admin | JF BNPB",
  robots: "noindex, nofollow",
};

export default function Page() {
  return <AdminLoginPage />;
}
