import { NextResponse } from "next/server"
import {
  readComments,
  writeComments,
  findCommentById,
} from "../../../../../lib/comments"
import { db } from "../../../../../lib/db"
import { auditLogs } from "../../../../../lib/schema"

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const data = await readComments()
  const found = findCommentById(data, params.id)
  if (!found) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  const comment = found.comment
  comment.flags = (comment.flags || 0) + 1
  await writeComments(data)

  try {
    await db.insert(auditLogs).values({
      id: crypto.randomUUID(),
      action: "flag_comment",
      entity: "comment",
      entityId: params.id,
    })
  } catch (e) {
    console.error("Failed to log audit", e)
  }

  return NextResponse.json(comment)
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const data = await readComments()
  const found = findCommentById(data, params.id)
  if (!found) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  const comment = found.comment
  comment.flags = Math.max(0, (comment.flags || 0) - 1)
  await writeComments(data)

  try {
    await db.insert(auditLogs).values({
      id: crypto.randomUUID(),
      action: "unflag_comment",
      entity: "comment",
      entityId: params.id,
    })
  } catch (e) {
    console.error("Failed to log audit", e)
  }

  return NextResponse.json(comment)
}
