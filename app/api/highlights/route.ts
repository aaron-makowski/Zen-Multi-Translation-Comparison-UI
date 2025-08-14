<<<<<<< HEAD
import { NextRequest, NextResponse } from "next/server"
import { eq, and } from "drizzle-orm"

import { db } from "@/lib/db"
import { highlights } from "@/lib/schema"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const verseId = searchParams.get("verseId")
  const userId = searchParams.get("userId")

  if (verseId && userId) {
    const data = await db
      .select()
      .from(highlights)
      .where(and(eq(highlights.verseId, verseId), eq(highlights.userId, userId)))
    return NextResponse.json(data)
  }

  if (verseId) {
    const data = await db
      .select()
      .from(highlights)
      .where(and(eq(highlights.verseId, verseId), eq(highlights.isPublic, true)))
    return NextResponse.json(data)
  }

  const data = await db
    .select()
    .from(highlights)
    .where(eq(highlights.isPublic, true))
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const { userId, verseId, start, end, note, isPublic = false } = await req.json()
  
  if (!verseId || typeof start !== "number" || typeof end !== "number" || !userId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const [highlight] = await db
    .insert(highlights)
    .values({
      id: crypto.randomUUID(),
      userId,
      verseId,
      start,
      end,
      note,
      isPublic,
      updatedAt: new Date(),
    })
    .returning()

  return NextResponse.json(highlight)
}

export async function PATCH(req: NextRequest) {
  const { id, isPublic } = await req.json()
  const [highlight] = await db
    .update(highlights)
    .set({ isPublic, updatedAt: new Date() })
    .where(eq(highlights.id, id))
    .returning()

  return NextResponse.json(highlight)
=======
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
>>>>>>> origin/codex/add-page-to-pull-latest-comments-and-highlights
}
