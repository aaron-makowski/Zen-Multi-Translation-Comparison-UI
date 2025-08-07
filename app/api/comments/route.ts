import { NextResponse } from "next/server"
import {
  Comment,
  readComments,
  writeComments,
  voteComment,
} from "../../../lib/comments"

export { Comment, voteComment }

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const verseId = searchParams.get("verseId")
  const data = await readComments()
  if (verseId) {
    return NextResponse.json(data[verseId] || [])
  }
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const { verseId, content } = await req.json()
  if (!verseId || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  const data = await readComments()
  const comment: Comment = {
    id: crypto.randomUUID(),
    content,
    createdAt: new Date().toISOString(),
    votes: 0,
    flags: 0,
  }
  if (!data[verseId]) data[verseId] = []
  data[verseId].push(comment)
  await writeComments(data)
  return NextResponse.json(comment)
}

export async function PATCH(req: Request) {
  const { verseId, commentId, delta } = await req.json()
  if (!verseId || !commentId || typeof delta !== "number") {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  const data = await readComments()
  const updated = voteComment(data, verseId, commentId, delta)
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  await writeComments(data)
  return NextResponse.json(updated)
}
