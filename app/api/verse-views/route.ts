import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verseViews } from "@/lib/schema"
import { eq } from "drizzle-orm"

export async function POST(req: Request) {
  const { verseId, translationId, userId, eventType } = await req.json()
  if (!verseId || !eventType) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  const id = crypto.randomUUID()
  await db.insert(verseViews).values({
    id,
    verseId,
    translationId,
    userId,
    eventType,
  })
  return NextResponse.json({ id })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const verseId = searchParams.get("verseId")
  if (verseId) {
    const views = await db.select().from(verseViews).where(eq(verseViews.verseId, verseId))
    return NextResponse.json(views)
  }
  const views = await db.select().from(verseViews)
  return NextResponse.json(views)
}
