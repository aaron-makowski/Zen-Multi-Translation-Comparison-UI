import type { NextRequest } from "next/server"
import { adminMiddleware } from "./lib/auth"

export function middleware(req: NextRequest) {
  return adminMiddleware(req)
}

export const config = {
  matcher: ["/admin/:path*"],
}
