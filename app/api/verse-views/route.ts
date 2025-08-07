import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verseViews } from "@/lib/schema"

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
