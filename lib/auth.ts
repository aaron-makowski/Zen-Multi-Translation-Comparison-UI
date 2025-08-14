import { NextRequest, NextResponse } from "next/server"

<<<<<<< HEAD
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
=======
export function requireRole(req: NextRequest, role: string) {
  const userRole = req.headers.get("x-user-role")
  if (userRole !== role) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
>>>>>>> origin/codex/protect-admin-routes-with-middleware
  }
  return NextResponse.next()
}

<<<<<<< HEAD
export function requireAdmin(req: NextRequest) {
=======
export function adminMiddleware(req: NextRequest) {
>>>>>>> origin/codex/protect-admin-routes-with-middleware
  return requireRole(req, "admin")
}
