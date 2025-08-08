import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { randomUUID } from "crypto"
import { eq } from "drizzle-orm"

export interface Comment {
  id: string
  userId?: string
  parentId?: string
  content: string
  createdAt: string
  updatedAt: string
  votes: number
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
  const { verseId, content, userId, parentId } = await req.json()
  if (!verseId || !content || !userId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  const data = await readData()
  const createdAt = new Date().toISOString()
  const comment: Comment = {
    id: randomUUID(),
    userId,
    parentId,
    content,
    createdAt,
    updatedAt: createdAt,
    votes: 0,
  }
  if (!data[verseId]) data[verseId] = []
  data[verseId].push(comment)
  await writeData(data)
  await handleNotifications(comment, data[verseId])
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

async function handleNotifications(comment: Comment, list: Comment[]) {
  const { createNotification } = await import("../../../lib/notifications")
  const { db } = await import("../../../lib/db")
  const { users } = await import("../../../lib/schema")

  if (comment.parentId) {
    const parent = list.find((c) => c.id === comment.parentId)
    if (parent?.userId && parent.userId !== comment.userId) {
      await createNotification({
        userId: parent.userId,
        actorId: comment.userId!,
        type: "reply",
        commentId: comment.id,
      })
    }
  }
  const mentions = comment.content.match(/@([A-Za-z0-9_]+)/g) || []
  for (const mention of mentions) {
    const username = mention.slice(1)
    const target = await db.query.users.findFirst({
      where: eq(users.username, username),
    })
    if (target && target.id !== comment.userId) {
      await createNotification({
        userId: target.id,
        actorId: comment.userId!,
        type: "mention",
        commentId: comment.id,
      })
    }
  }
}
