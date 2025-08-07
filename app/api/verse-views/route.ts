import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verseViews } from "@/lib/schema"
import { eq, and } from "drizzle-orm"

export async function POST(req: Request) {
  const { verseId, translationId, userId } = await req.json()
  if (!verseId) {
    return NextResponse.json({ error: "Missing verseId" }, { status: 400 })
  }
  await db.insert(verseViews).values({
    id: crypto.randomUUID(),
    verseId,
    translationId,
    userId,
  })
  return NextResponse.json({ success: true })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const verseId = searchParams.get("verseId")
  const userId = searchParams.get("userId")
  const conditions = [] as any[]
  if (verseId) conditions.push(eq(verseViews.verseId, verseId))
  if (userId) conditions.push(eq(verseViews.userId, userId))
  let whereClause
  if (conditions.length === 1) whereClause = conditions[0]
  else if (conditions.length > 1) whereClause = and(...conditions)
  let query = db.select().from(verseViews)
  if (whereClause) query = query.where(whereClause as any)
  const data = await query
  return NextResponse.json(data)
}
