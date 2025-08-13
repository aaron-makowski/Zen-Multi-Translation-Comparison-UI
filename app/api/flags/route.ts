import { NextResponse } from "next/server"
import { db } from "../../../lib/db"
import { flags, auditLogs } from "../../../lib/schema"
import { v4 as uuidv4 } from "uuid"
import { getUserFromRequest } from "../../../lib/auth"

export async function GET() {
  const allFlags = await db.select().from(flags)
  return NextResponse.json(allFlags)
}

export async function POST(req: Request) {
  const { commentId, reason } = await req.json()
  if (!commentId) {
    return NextResponse.json({ error: "Missing commentId" }, { status: 400 })
  }
  const user = getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const id = uuidv4()
  await db.insert(flags).values({
    id,
    commentId,
    userId: user.id,
    reason,
    createdAt: new Date(),
  })
  await db.insert(auditLogs).values({
    id: uuidv4(),
    userId: user.id,
    action: "flag_created",
    targetType: "comment",
    targetId: commentId,
    createdAt: new Date(),
  })
  return NextResponse.json({ id, commentId, reason })
}
