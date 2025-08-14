/**
 * In-memory IP-based rate limiter for API routes.
 *
 * Counters are stored in a local Map, so limits reset on server restart and
 * are not shared across multiple instances. This offers only best-effort
 * protection against bursts of traffic.
 */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface RateLimitInfo {
  count: number;
  timestamp: number;
}

const WINDOW = 60_000; // 1 minute
const LIMIT = 100;
const requests = new Map<string, RateLimitInfo>();

export function middleware(req: NextRequest) {
  const ip = req.ip ?? "127.0.0.1";
  const now = Date.now();
  const record = requests.get(ip);

  if (!record || now - record.timestamp > WINDOW) {
    requests.set(ip, { count: 1, timestamp: now });
    return NextResponse.next();
  }

  record.count += 1;
  if (record.count > LIMIT) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  return NextResponse.next();
}
