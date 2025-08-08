import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

interface Highlight {
  id: string
  verseId: number
  username: string
  karma: number
  text: string
  createdAt: string
}

const HIGHLIGHTS_FILE = path.join(process.cwd(), "data", "highlights.json")

async function readData() {
  try {
    const data = await fs.readFile(HIGHLIGHTS_FILE, "utf8")
    return JSON.parse(data || "[]")
  } catch {
    return []
  }
}

export async function GET() {
  const data = await readData()
  return NextResponse.json(data)
}
