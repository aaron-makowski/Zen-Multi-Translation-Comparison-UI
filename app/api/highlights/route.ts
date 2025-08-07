import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { highlights } from "@/lib/schema"
import { eq, and } from "drizzle-orm"

export async function GET(req: Request) {
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

export async function POST(req: Request) {
  const { verseId, start, end, isPublic = true, userId } = await req.json()
  if (!verseId || typeof start !== "number" || typeof end !== "number" || !userId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  const [highlight] = await db
    .insert(highlights)
    .values({
      id: crypto.randomUUID(),
      verseId,
      userId,
      start,
      end,
      isPublic,
      updatedAt: new Date(),
    })
    .returning()
  return NextResponse.json(highlight)
}
