import { NextResponse } from "next/server"
import { db } from "../../../lib/db"
import { notifications } from "../../../lib/schema"
import { eq } from "drizzle-orm"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 })
  }
  const rows = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
  return NextResponse.json(rows)
}

export async function PATCH(req: Request) {
  const { id } = await req.json()
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }
  await db.update(notifications).set({ read: true }).where(eq(notifications.id, id))
  return NextResponse.json({ success: true })
}
