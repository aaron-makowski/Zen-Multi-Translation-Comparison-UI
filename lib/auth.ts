import { NextRequest, NextResponse } from "next/server"

export function requireRole(req: NextRequest, role: string) {
  const userRole = req.headers.get("x-user-role")
  if (userRole !== role) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  return NextResponse.next()
}

export function adminMiddleware(req: NextRequest) {
  return requireRole(req, "admin")
}
