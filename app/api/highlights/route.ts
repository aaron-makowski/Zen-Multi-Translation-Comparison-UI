import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

export interface Highlight {
  id: string
  verseId: number
  text: string
  createdAt: string
}

const FILE = path.join(process.cwd(), "data", "highlights.json")

export async function GET() {
  try {
    const data = await fs.readFile(FILE, "utf8")
    return NextResponse.json(JSON.parse(data || "[]"))
  } catch {
    return NextResponse.json([])
  }
}
