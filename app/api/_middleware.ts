// NOTE: This rate limiter stores counts in memory and is unsuitable for serverless or
// multi-instance deployments. It should only be used for development or single-instance
// production setups. For robust deployments, use a distributed store like Redis.
import { NextRequest, NextResponse } from 'next/server';

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100;

const ipHits = new Map<string, { count: number; timestamp: number }>();

export function middleware(req: NextRequest) {
  const ip =
    req.ip ||
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    'unknown';

  const now = Date.now();
  const record = ipHits.get(ip) || { count: 0, timestamp: now };

  if (now - record.timestamp > RATE_LIMIT_WINDOW_MS) {
    record.count = 0;
    record.timestamp = now;
  }

  record.count += 1;
  ipHits.set(ip, record);

  if (record.count > RATE_LIMIT_MAX_REQUESTS) {
    return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
