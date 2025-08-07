import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { translators } from "@/lib/translations"

interface Featured {
  translatorId: string
  updatedAt: string
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

export async function GET() {
  const data = await readData()
  if (!data) return NextResponse.json(null)
  const translator = translators.find((t) => t.id === data.translatorId)
  return NextResponse.json({ ...data, translator })
}
