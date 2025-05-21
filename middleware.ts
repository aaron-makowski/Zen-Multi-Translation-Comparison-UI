import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSession } from "./lib/auth"

export async function middleware(request: NextRequest) {
  const session = await getSession()

  // Protected routes that require authentication
  const protectedPaths = ["/dashboard", "/profile", "/favorites", "/notes"]

  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  // Auth routes
  const authRoutes = ["/login", "/register"]
  const isAuthRoute = authRoutes.some((route) => request.nextUrl.pathname === route)

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Redirect unauthenticated users away from protected routes
  if (isProtectedPath && !session) {
    // Add a return_to parameter to redirect back after login
    const returnTo = encodeURIComponent(request.nextUrl.pathname)
    return NextResponse.redirect(new URL(`/login?return_to=${returnTo}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/favorites/:path*", "/notes/:path*", "/login", "/register"],
}
