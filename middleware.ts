import { chain, chainMatch, csp, isPageRequest, strictDynamic } from "@next-safe/middleware";
import { NextResponse } from "next/server";
import type { NextMiddleware, NextRequest } from "next/server";

// Basic CSRF protection requiring same-origin for state-changing requests
const csrf: NextMiddleware = (req: NextRequest) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");
    if (origin && host && !origin.endsWith(host)) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }
  return NextResponse.next();
};

export default chain(
  csrf,
  chainMatch(isPageRequest)(csp(), strictDynamic())
);
