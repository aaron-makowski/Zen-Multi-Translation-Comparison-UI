import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export interface Highlight {
  id: string
  verseId: string
  content: string
  createdAt: string
  user: {
    name: string
    karma: number
  }
}

const HIGHLIGHTS_FILE = path.join(process.cwd(), "data", "highlights.json")

async function readData(): Promise<Highlight[]> {
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
