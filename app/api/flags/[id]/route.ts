import { NextResponse } from "next/server"
import { db } from "../../../../lib/db"
import { flags, auditLogs } from "../../../../lib/schema"
import { eq } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"
import { getUserFromRequest } from "../../../../lib/auth"

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const user = getUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  await db.delete(flags).where(eq(flags.id, params.id))
  await db.insert(auditLogs).values({
    id: uuidv4(),
    userId: user.id,
    action: "flag_removed",
    targetType: "flag",
    targetId: params.id,
    createdAt: new Date(),
  })
  return NextResponse.json({ success: true })
}
