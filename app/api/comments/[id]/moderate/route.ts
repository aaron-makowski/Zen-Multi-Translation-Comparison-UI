import { NextResponse } from "next/server"
import { readData, writeData, Comment } from "../../route"

function findComment(data: Record<string, Comment[]>, id: string) {
  for (const [verseId, list] of Object.entries(data)) {
    const comment = list.find((c) => c.id === id)
    if (comment) return { comment, verseId }
  }
  return null
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { action } = await req.json()
  if (action !== "flag") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }
  const data = await readData()
  const found = findComment(data, params.id)
  if (!found) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  found.comment.flagged = true
  await writeData(data)
  return NextResponse.json(found.comment)
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const data = await readData()
  const found = findComment(data, params.id)
  if (!found) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  found.comment.removed = true
  found.comment.content = "[removed]"
  await writeData(data)
  return NextResponse.json({ success: true })
}
