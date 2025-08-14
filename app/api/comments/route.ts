import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
<<<<<<< HEAD
<<<<<<< HEAD
import { Redis } from "@upstash/redis"
=======
import { renderMarkdown } from "../../../lib/markdown"
>>>>>>> origin/codex/extend-api-for-nested-comments-support
=======
import { addNotification } from "../../../lib/notifications"
>>>>>>> origin/codex/add-notifications-table-and-handlers

export interface Comment {
  id: string
  content: string
  createdAt: string
  votes: number
<<<<<<< HEAD
<<<<<<< HEAD
  username?: string
=======
  parentId?: string | null
  flagged?: boolean
>>>>>>> origin/codex/extend-api-for-nested-comments-support
=======
  userId?: string
  parentId?: string
>>>>>>> origin/codex/add-notifications-table-and-handlers
}

const COMMENTS_FILE = path.join(process.cwd(), "data", "comments.json")

<<<<<<< HEAD
let redis: Redis | null = null
try {
  redis = Redis.fromEnv()
} catch {
  redis = null
}

async function readData() {
=======
export async function readData() {
>>>>>>> origin/codex/extend-api-for-nested-comments-support
  try {
    const data = await fs.readFile(COMMENTS_FILE, "utf8")
    return JSON.parse(data || "{}")
  } catch {
    return {}
  }
}

export async function writeData(data: Record<string, Comment[]>) {
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
<<<<<<< HEAD
  if (verseId) {
    const cacheKey = `comments:${verseId}`
    if (redis) {
      const cached = await redis.get(cacheKey)
      if (cached) {
        return NextResponse.json(cached)
      }
    }
    const data = await readData()
    const comments = data[verseId] || []
    if (redis) {
      await redis.set(cacheKey, comments, { ex: 60 })
    }
    return NextResponse.json(comments)
=======
  const parentId = searchParams.get("parentId")
  const data = await readData()
  if (verseId) {
    let list = data[verseId] || []
    if (parentId !== null) {
      list = list.filter((c) => c.parentId === parentId)
    } else {
      list = list.filter((c) => !c.parentId)
    }
    return NextResponse.json(list)
>>>>>>> origin/codex/extend-api-for-nested-comments-support
  }
  const data = await readData()
  return NextResponse.json(data)
}

export async function POST(req: Request) {
<<<<<<< HEAD
<<<<<<< HEAD
  const { verseId, content, username } = await req.json()
=======
  const { verseId, content, parentId } = await req.json()
>>>>>>> origin/codex/extend-api-for-nested-comments-support
=======
  const { verseId, content, userId = "anonymous", parentId } = await req.json()
>>>>>>> origin/codex/add-notifications-table-and-handlers
  if (!verseId || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  const sanitized = renderMarkdown(content)
  const data = await readData()
  const comment: Comment = {
    id: crypto.randomUUID(),
    content: sanitized,
    createdAt: new Date().toISOString(),
    votes: 0,
<<<<<<< HEAD
<<<<<<< HEAD
    username: username || "Anonymous",
=======
    parentId: parentId ?? null,
    flagged: false,
>>>>>>> origin/codex/extend-api-for-nested-comments-support
=======
    userId,
    parentId,
>>>>>>> origin/codex/add-notifications-table-and-handlers
  }
  if (!data[verseId]) data[verseId] = []
  data[verseId].push(comment)
  await writeData(data)
<<<<<<< HEAD
  if (redis) {
    await redis.del(`comments:${verseId}`)
=======

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
>>>>>>> origin/codex/add-notifications-table-and-handlers
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
  if (redis) {
    await redis.del(`comments:${verseId}`)
  }
  return NextResponse.json(updated)
}
