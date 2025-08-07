import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { redis } from "../../../lib/redis"

export interface Comment {
  id: string
  content: string
  createdAt: string
  votes: number
}

const COMMENTS_FILE = path.join(process.cwd(), "data", "comments.json")

async function readData() {
  if (redis) {
    const cached = await redis.get<Record<string, Comment[]>>("comments")
    if (cached) return cached
  }
  try {
    const data = await fs.readFile(COMMENTS_FILE, "utf8")
    const parsed = JSON.parse(data || "{}")
    if (redis) await redis.set("comments", parsed, { ex: 60 })
    return parsed
  } catch {
    return {}
  }
}

async function writeData(data: Record<string, Comment[]>) {
  await fs.mkdir(path.dirname(COMMENTS_FILE), { recursive: true })
  await fs.writeFile(COMMENTS_FILE, JSON.stringify(data, null, 2))
  if (redis) {
    await redis.set("comments", data, { ex: 60 })
  }
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
