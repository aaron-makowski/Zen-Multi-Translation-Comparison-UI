import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { bookmarks } from "@/lib/schema"
import { and, eq } from "drizzle-orm"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 })
  }
  const data = await db.select().from(bookmarks).where(eq(bookmarks.userId, userId))
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const { userId, verseId } = await req.json()
  if (!userId || !verseId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  const [bookmark] = await db
    .insert(bookmarks)
    .values({ id: crypto.randomUUID(), userId, verseId, updatedAt: new Date() })
    .onConflictDoNothing({ target: [bookmarks.userId, bookmarks.verseId] })
    .returning()
  return NextResponse.json(bookmark)
}

export async function DELETE(req: Request) {
  const { userId, verseId } = await req.json()
  if (!userId || !verseId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  await db
    .delete(bookmarks)
    .where(and(eq(bookmarks.userId, userId), eq(bookmarks.verseId, verseId)))
  return NextResponse.json({ success: true })
}
