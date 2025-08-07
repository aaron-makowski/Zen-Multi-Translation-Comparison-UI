import { NextRequest, NextResponse } from "next/server"

export function adminMiddleware(req: NextRequest) {
  const role = req.headers.get("x-user-role")
  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  return NextResponse.next()
}
