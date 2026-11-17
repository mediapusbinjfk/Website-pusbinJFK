import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyTokenAsync, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Bypass check for login page itself
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // 2. Protect Admin UI Routes
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const isValid = sessionCookie ? await verifyTokenAsync(sessionCookie) : false;

    if (!isValid) {
      // Stealth defense: redirect unauthorized users to public home
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  // 3. Protect Admin & Sensitive API Routes
  const isAdminApi = pathname.startsWith("/api/admin");
  const isMutatingCalendar =
    pathname.startsWith("/api/calendar") && request.method !== "GET";
  const isEmailApi = pathname.startsWith("/api/send-email");

  if (isAdminApi || isMutatingCalendar || isEmailApi) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const authHeader = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    const token = sessionCookie || authHeader;
    const isValid = token ? await verifyTokenAsync(token) : false;

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Akses ditolak: Autentikasi sesi administrator diperlukan.",
        },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/calendar/:path*",
    "/api/send-email",
  ],
};

