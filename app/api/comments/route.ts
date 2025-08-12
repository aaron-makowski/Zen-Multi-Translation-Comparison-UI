import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { marked } from "marked"
import sanitizeHtml from "sanitize-html"

export interface Comment {
  id: string
  content: string
  createdAt: string
  votes: number
  parentId?: string
  flagged?: boolean
  removed?: boolean
}

const COMMENTS_FILE = path.join(process.cwd(), "data", "comments.json")

export async function readData() {
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
  const parentId = searchParams.get("parentId")
  const data = await readData()
  if (verseId) {
    let list = data[verseId] || []
    if (parentId) {
      list = list.filter((c) => c.parentId === parentId)
    }
    return NextResponse.json(list)
  }
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const { verseId, content, parentId } = await req.json()
  if (!verseId || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  const rawHtml = marked.parse(content)
  const safeContent = sanitizeHtml(rawHtml)
  const data = await readData()
  const comment: Comment = {
    id: crypto.randomUUID(),
    content: safeContent,
    createdAt: new Date().toISOString(),
    votes: 0,
    parentId,
    flagged: false,
    removed: false,
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
