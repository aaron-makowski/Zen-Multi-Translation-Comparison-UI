import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { Redis } from "@upstash/redis"

export interface Comment {
  id: string
  content: string
  createdAt: string
  votes: number
}

const COMMENTS_FILE = path.join(process.cwd(), "data", "comments.json")

let redis: Redis | null = null
try {
  redis = Redis.fromEnv()
} catch {
  redis = null
}

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
  }
  const data = await readData()
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const { verseId, content } = await req.json()
  if (!verseId || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  const data = await readData()
  const comment: Comment = {
    id: crypto.randomUUID(),
    content,
    createdAt: new Date().toISOString(),
    votes: 0,
  }
  if (!data[verseId]) data[verseId] = []
  data[verseId].push(comment)
  await writeData(data)
  if (redis) {
    await redis.del(`comments:${verseId}`)
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
