import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { translators } from "@/lib/translations"

const FEATURED_FILE = path.join(process.cwd(), "data", "featured.json")

export async function GET() {
  const translator = translators[Math.floor(Math.random() * translators.length)]
  const data = {
    translatorId: translator.id,
    updatedAt: new Date().toISOString(),
  }
  await fs.mkdir(path.dirname(FEATURED_FILE), { recursive: true })
  await fs.writeFile(FEATURED_FILE, JSON.stringify(data, null, 2))
  return NextResponse.json(data)
}
