import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export interface Highlight {
  id: string
  verseId: string
  userId: string
  start: number
  end: number
  content?: string
  isPublic: boolean
  createdAt: string
}

const HIGHLIGHTS_FILE = path.join(process.cwd(), "data", "highlights.json")

async function readData() {
  try {
    const data = await fs.readFile(HIGHLIGHTS_FILE, "utf8")
    return JSON.parse(data || "{}")
  } catch {
    return {}
  }
}

async function writeData(data: Record<string, Highlight[]>) {
  await fs.mkdir(path.dirname(HIGHLIGHTS_FILE), { recursive: true })
  await fs.writeFile(HIGHLIGHTS_FILE, JSON.stringify(data, null, 2))
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
  const { verseId, userId, start, end, content, isPublic } = await req.json()
  if (!verseId || !userId || typeof start !== "number" || typeof end !== "number") {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  const data = await readData()
  const highlight: Highlight = {
    id: crypto.randomUUID(),
    verseId,
    userId,
    start,
    end,
    content,
    isPublic: !!isPublic,
    createdAt: new Date().toISOString(),
  }
  if (!data[verseId]) data[verseId] = []
  data[verseId].push(highlight)
  await writeData(data)
  return NextResponse.json(highlight)
}

export async function PATCH(req: Request) {
  const { verseId, highlightId, isPublic } = await req.json()
  if (!verseId || !highlightId || typeof isPublic !== "boolean") {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  const data = await readData()
  const list = data[verseId]
  if (!list) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  const highlight = list.find((h) => h.id === highlightId)
  if (!highlight) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  highlight.isPublic = isPublic
  await writeData(data)
  return NextResponse.json(highlight)
}
