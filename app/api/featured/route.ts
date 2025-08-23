import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

<<<<<<< HEAD
interface Featured {
  translatorId: string
  verseId: number
  createdAt: string
}

const FEATURED_FILE = path.join(process.cwd(), "data", "featured.json")

async function readData(): Promise<Featured | null> {
  try {
    const data = await fs.readFile(FEATURED_FILE, "utf8")
    return JSON.parse(data || "null")
  } catch {
    return null
  }
}

async function writeData(data: Featured) {
  await fs.mkdir(path.dirname(FEATURED_FILE), { recursive: true })
  await fs.writeFile(FEATURED_FILE, JSON.stringify(data, null, 2))
}

export async function GET() {
  const data = await readData()
  if (!data) return NextResponse.json({ error: "Not set" }, { status: 404 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const { translatorId, verseId } = await req.json()
  if (!translatorId || typeof verseId !== "number") {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  const payload: Featured = {
    translatorId,
    verseId,
    createdAt: new Date().toISOString()
  }
  await writeData(payload)
  return NextResponse.json(payload)
=======
const FILE = path.join(process.cwd(), "data", "featured.json")

export async function GET() {
  try {
    const data = await fs.readFile(FILE, "utf8")
    return NextResponse.json(JSON.parse(data || "{}"))
  } catch {
    return NextResponse.json({})
  }
>>>>>>> origin/codex/add-page-to-pull-latest-comments-and-highlights
}
