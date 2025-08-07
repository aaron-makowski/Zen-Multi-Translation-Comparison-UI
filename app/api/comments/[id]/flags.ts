import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { flags, auditLogs } from "@/lib/schema"
import { eq } from "drizzle-orm"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { reason, userId } = await req.json()
  const flagId = crypto.randomUUID()
  await db.insert(flags).values({
    id: flagId,
    commentId: params.id,
    userId,
    reason,
  })
  await db.insert(auditLogs).values({
    id: crypto.randomUUID(),
    action: "flag_comment",
    targetType: "comment",
    targetId: params.id,
    userId,
  })
  return NextResponse.json({ id: flagId })
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await req.json()
  await db.delete(flags).where(eq(flags.commentId, params.id))
  await db.insert(auditLogs).values({
    id: crypto.randomUUID(),
    action: "unflag_comment",
    targetType: "comment",
    targetId: params.id,
    userId,
  })
  return NextResponse.json({ success: true })
}
