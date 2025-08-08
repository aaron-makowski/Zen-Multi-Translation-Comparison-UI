/**
 * Global middleware applying security headers and CSRF protection.
 *
 * `@next-safe/middleware` sets common headers like CSP and others to harden
 * against XSS and related attacks. A custom CSRF layer issues a token cookie
 * and requires clients to echo it in an `x-csrf-token` header for mutating
 * requests, implementing a double-submit strategy.
 */
import { chain, nextSafe, type ChainableMiddleware } from "@next-safe/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const csrf: ChainableMiddleware = (req, _evt, ctx) => {
  const res = (ctx.res.get() as NextResponse) ?? NextResponse.next();
  let token = req.cookies.get("csrf-token")?.value;
  if (!token) {
    token = crypto.randomUUID();
    res.cookies.set("csrf-token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }

  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    const header = req.headers.get("x-csrf-token");
    if (!header || header !== token) {
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
    }
  }

  ctx.res.set(res);
};

export default chain(nextSafe(), csrf);

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
