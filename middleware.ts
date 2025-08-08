import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "./lib/auth"

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/admin")) {
    return requireAdmin(req)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
