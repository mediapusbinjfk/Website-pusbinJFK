import type { NextRequest } from "next/server";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "jf_admin_session";
const SESSION_EXPIRY_SECONDS = 60 * 60 * 8; // 8 hours

export function getAuthSecret(): string {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "bnpb-jf-portal-super-secure-token-secret-2026";
}

export interface SessionPayload {
  username: string;
  role: string;
  exp: number;
}

/**
 * Creates an HMAC-SHA256 signed session token
 */
export function createSessionToken(username: string, role = "admin"): string {
  const secret = getAuthSecret();
  const exp = Math.floor(Date.now() / 1000) + SESSION_EXPIRY_SECONDS;
  const payload: SessionPayload = { username, role, exp };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url");

  return `${encodedPayload}.${signature}`;
}

/**
 * Verifies an HMAC-SHA256 signed session token
 */
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [encodedPayload, signature] = parts;
    const secret = getAuthSecret();
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(encodedPayload)
      .digest("base64url");

    // Timing-safe comparison to prevent timing attacks
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (sigBuffer.length !== expectedBuffer.length) return null;
    if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return null;

    const payload: SessionPayload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf-8")
    );

    // Check expiration
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Web Crypto API compatible token verification (safe for Proxy/Edge and Node.js)
 */
export async function verifyTokenAsync(token: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;

    const [encodedPayload, signature] = parts;
    const secret = getAuthSecret();

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const sigArrayBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      enc.encode(encodedPayload)
    );

    const expectedSig = Buffer.from(sigArrayBuffer).toString("base64url");
    if (signature !== expectedSig) return false;

    const payload: SessionPayload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf-8")
    );

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Server-side helper to verify admin session from Request cookies or Authorization header
 */
export function verifyAdminSession(request: NextRequest | Request): SessionPayload | null {
  try {
    // 1. Check HttpOnly cookie
    let token: string | undefined;

    if ("cookies" in request && typeof (request as NextRequest).cookies?.get === "function") {
      token = (request as NextRequest).cookies.get(SESSION_COOKIE_NAME)?.value;
    } else {
      const cookieHeader = request.headers.get("cookie") || "";
      const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]*)`));
      token = match ? decodeURIComponent(match[1]) : undefined;
    }

    // 2. Check Authorization Bearer header fallback
    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7).trim();
      }
    }

    if (!token) return null;

    return verifySessionToken(token);
  } catch {
    return null;
  }
}

export { SESSION_COOKIE_NAME, SESSION_EXPIRY_SECONDS };
