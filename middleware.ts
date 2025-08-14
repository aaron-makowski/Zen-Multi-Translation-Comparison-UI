<<<<<<< HEAD
<<<<<<< HEAD
import createMiddleware from "next-intl/middleware"
import { NextRequest, NextResponse } from "next/server"

const intlMiddleware = createMiddleware({
  locales: ["en", "es"],
  defaultLocale: "en"
})

function unauthorized() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": "Basic realm=\"Secure Area\"" }
  })
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const basic = req.headers.get("authorization")
    if (!basic) return unauthorized()
    const decode = (str: string) =>
      typeof atob === "function"
        ? atob(str)
        : Buffer.from(str, "base64").toString()
    const [user, pass] = decode(basic.split(" ")[1] || "").split(":")
    if (
      user !== process.env.ADMIN_USER ||
      pass !== process.env.ADMIN_PASS
    ) {
      return unauthorized()
    }
  }
  if (pathname.startsWith("/api")) {
    return NextResponse.next()
  }
  return intlMiddleware(req)
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)", "/api/admin/:path*"]
}
=======
import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from './i18n';

export default createMiddleware({
  locales,
  defaultLocale
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
>>>>>>> origin/codex/set-up-next-intl-with-translations
=======
import type { NextRequest } from "next/server"
import { adminMiddleware } from "./lib/auth"

export function middleware(req: NextRequest) {
  return adminMiddleware(req)
}

export const config = {
  matcher: ["/admin/:path*"],
}
>>>>>>> origin/codex/protect-admin-routes-with-middleware
