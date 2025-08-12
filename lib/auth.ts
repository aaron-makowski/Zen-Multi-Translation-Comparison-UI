import { NextRequest, NextResponse } from "next/server"

export interface AuthUser {
  id: string
  role: "user" | "admin"
}

export function getUserFromRequest(req: { headers: Headers }): AuthUser | null {
  const id = req.headers.get("x-user-id")
  const role = req.headers.get("x-user-role") as AuthUser["role"] | null
  if (!id || !role) return null
  return { id, role }
}

export function requireRole(req: NextRequest, role: AuthUser["role"]) {
  const user = getUserFromRequest(req)
  if (!user || user.role !== role) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
  return NextResponse.next()
}

export function requireAdmin(req: NextRequest) {
  return requireRole(req, "admin")
}
