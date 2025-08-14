import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { translators } from "@/lib/translations"

const FILE = path.join(process.cwd(), "data", "featured.json")

export const dynamic = "force-dynamic"

export async function GET() {
  const pick = translators[Math.floor(Math.random() * translators.length)]
  const payload = { translatorId: pick.id, updatedAt: new Date().toISOString() }
  await fs.mkdir(path.dirname(FILE), { recursive: true })
  await fs.writeFile(FILE, JSON.stringify(payload, null, 2))
  return NextResponse.json(payload)
}
