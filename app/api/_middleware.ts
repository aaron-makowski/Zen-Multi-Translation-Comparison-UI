import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory rate limiting per IP
const WINDOW_MS = 60_000; // 1 minute window
const MAX_REQUESTS = 60; // Max 60 requests per minute

const ipHits = new Map<string, { count: number; expires: number }>();

export function middleware(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.ip ||
    "unknown";

  const now = Date.now();
  const record = ipHits.get(ip) || { count: 0, expires: now + WINDOW_MS };

  if (now > record.expires) {
    record.count = 0;
    record.expires = now + WINDOW_MS;
  }

  record.count++;
  ipHits.set(ip, record);

  if (record.count > MAX_REQUESTS) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};

export default middleware;
