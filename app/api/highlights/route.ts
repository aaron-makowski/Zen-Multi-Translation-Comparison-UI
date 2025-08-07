import { NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { highlights } from "@/lib/schema"

export async function POST(req: NextRequest) {
  const { userId, verseId, start, end, note, isPublic = false } = await req.json()
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
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const verseId = searchParams.get("verseId")
  const userId = searchParams.get("userId")

  if (!verseId) {
    return NextResponse.json([])
  }

  const rows = await db.select().from(highlights).where(eq(highlights.verseId, verseId))
  const filtered = userId
    ? rows.filter((h) => h.isPublic || h.userId === userId)
    : rows.filter((h) => h.isPublic)
  return NextResponse.json(filtered)
}
