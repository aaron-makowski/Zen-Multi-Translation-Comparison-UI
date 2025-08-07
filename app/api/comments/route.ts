import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { addNotification } from "../../../lib/notifications"

export interface Comment {
  id: string
  content: string
  createdAt: string
  votes: number
  userId?: string
  parentId?: string
}

const COMMENTS_FILE = path.join(process.cwd(), "data", "comments.json")

async function readData() {
  try {
    const data = await fs.readFile(COMMENTS_FILE, "utf8")
    return JSON.parse(data || "{}")
  } catch {
    return {}
  }
}

async function writeData(data: Record<string, Comment[]>) {
  await fs.mkdir(path.dirname(COMMENTS_FILE), { recursive: true })
  await fs.writeFile(COMMENTS_FILE, JSON.stringify(data, null, 2))
}

export function voteComment(
  data: Record<string, Comment[]>,
  verseId: string,
  commentId: string,
  delta: number
) {
  const list = data[verseId]
  if (!list) return null
  const comment = list.find((c) => c.id === commentId)
  if (!comment) return null
  comment.votes = (comment.votes ?? 0) + delta
  return comment
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const verseId = searchParams.get("verseId")
  const data = await readData()
  if (verseId) {
    return NextResponse.json(data[verseId] || [])
  }
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const { verseId, content, userId = "anonymous", parentId } = await req.json()
  if (!verseId || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  const data = await readData()
  const comment: Comment = {
    id: crypto.randomUUID(),
    content,
    createdAt: new Date().toISOString(),
    votes: 0,
    userId,
    parentId,
  }
  if (!data[verseId]) data[verseId] = []
  data[verseId].push(comment)
  await writeData(data)

  // Emit reply notification
  if (parentId) {
    const parent = data[verseId].find((c) => c.id === parentId)
    if (parent && parent.userId && parent.userId !== userId) {
      await addNotification({
        userId: parent.userId,
        type: "reply",
        data: JSON.stringify({ verseId, commentId: comment.id }),
      })
    }
  }

  // Emit mention notifications
  const mentionRegex = /@([a-zA-Z0-9_]+)/g
  const mentions = content.match(mentionRegex) || []
  for (const mention of mentions) {
    const mentionUser = mention.slice(1)
    if (mentionUser && mentionUser !== userId) {
      await addNotification({
        userId: mentionUser,
        type: "mention",
        data: JSON.stringify({ verseId, commentId: comment.id }),
      })
    }
  }
  return NextResponse.json(comment)
}

export async function PATCH(req: Request) {
  const { verseId, commentId, delta } = await req.json()
  if (!verseId || !commentId || typeof delta !== "number") {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  const data = await readData()
  const updated = voteComment(data, verseId, commentId, delta)
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  await writeData(data)
  return NextResponse.json(updated)
}
