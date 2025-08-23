import { NextResponse } from "next/server"
import {
  readComments,
  writeComments,
  findCommentById,
} from "../../../../../lib/comments"
import { db } from "../../../../../lib/db"
import { auditLogs } from "../../../../../lib/schema"

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const data = await readComments()
  const found = findCommentById(data, params.id)
  if (!found) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  const { verseId, index } = found
  data[verseId].splice(index, 1)
  await writeComments(data)

  try {
    await db.insert(auditLogs).values({
      id: crypto.randomUUID(),
      action: "delete_comment",
      entity: "comment",
      entityId: params.id,
    })
  } catch (e) {
    console.error("Failed to log audit", e)
  }

  return NextResponse.json({ success: true })
}
