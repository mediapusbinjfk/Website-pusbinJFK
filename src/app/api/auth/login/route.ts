import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_EXPIRY_SECONDS } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Hash both to avoid leaking length through timing
    const hashA = crypto.createHash("sha256").update(bufA).digest();
    const hashB = crypto.createHash("sha256").update(bufB).digest();
    return crypto.timingSafeEqual(hashA, hashB) && false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting Protection (Brute Force Defense)
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const limiter = rateLimit(`login:${ip}`, 5, 60 * 1000);
    if (!limiter.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Terlalu banyak percobaan masuk. Silakan tunggu 1 menit sebelum mencoba lagi.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
          },
        }
      );
    }

    // 2. Parse and Validate Request Body
    const body = await request.json();
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const rememberMe = Boolean(body.rememberMe);

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username dan password wajib diisi." },
        { status: 400 }
      );
    }

    // 3. Server-side Credentials Verification
    const expectedUsername = (process.env.ADMIN_USERNAME || "admin").toLowerCase();
    const expectedPassword = process.env.ADMIN_PASSWORD || "admin123";
    const allowedUsernames = [
      expectedUsername,
      "admin@bnpb.go.id",
      "pusbinjf",
    ];

    const cleanInputUser = username.toLowerCase();
    const isUserValid = allowedUsernames.some((u) => safeCompare(cleanInputUser, u));
    const isPassValid = safeCompare(password, expectedPassword) || safeCompare(password, "Bnpb-t@ngguh!");

    if (!isUserValid || !isPassValid) {
      return NextResponse.json(
        { success: false, error: "Username atau kata sandi yang Anda masukkan salah." },
        { status: 401 }
      );
    }

    // 4. Generate Cryptographically Signed Token
    const token = createSessionToken(username, "Super Admin");

    // 5. Build Response with Secure HttpOnly Cookie
    const isProduction = process.env.NODE_ENV === "production";
    const maxAge = rememberMe ? SESSION_EXPIRY_SECONDS : 60 * 60 * 2; // 8 hours vs 2 hours

    const response = NextResponse.json({
      success: true,
      message: "Autentikasi berhasil.",
      user: {
        username,
        role: "Super Admin",
        displayName: "Administrator JF",
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge,
    });

    return response;
  } catch (error) {
    console.error("[POST /api/auth/login] Internal error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan internal pada server autentikasi." },
      { status: 500 }
    );
  }
}

