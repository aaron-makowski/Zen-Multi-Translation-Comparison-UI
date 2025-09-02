import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const BOOKMARKS_FILE = path.join(process.cwd(), "data", "bookmarks.json")

async function readData() {
  try {
    const data = await fs.readFile(BOOKMARKS_FILE, "utf8")
    return JSON.parse(data || "[]") as string[]
  } catch {
    return [] as string[]
  }
}

async function writeData(data: string[]) {
  await fs.mkdir(path.dirname(BOOKMARKS_FILE), { recursive: true })
  await fs.writeFile(BOOKMARKS_FILE, JSON.stringify(data, null, 2))
}

export async function GET() {
  const data = await readData()
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const { verseId } = await req.json()
  if (!verseId) {
    return NextResponse.json({ error: "Missing verseId" }, { status: 400 })
  }
  const data = await readData()
  if (!data.includes(verseId)) {
    data.push(verseId)
    await writeData(data)
  }
  return NextResponse.json({ verseId })
}

export async function DELETE(req: Request) {
  const { verseId } = await req.json()
  if (!verseId) {
    return NextResponse.json({ error: "Missing verseId" }, { status: 400 })
  }
  let data = await readData()
  data = data.filter((id) => id !== verseId)
  await writeData(data)
  return NextResponse.json({ verseId })
}
