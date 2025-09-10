import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { favorites } from "@/lib/schema"
import { eq, and } from "drizzle-orm"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 })
  }
  const rows = await db.select().from(favorites).where(eq(favorites.userId, userId))
  return NextResponse.json(rows)
}

export async function POST(req: Request) {
  const { userId, bookId } = await req.json()
  if (!userId || !bookId) {
    return NextResponse.json({ error: "Missing userId or bookId" }, { status: 400 })
  }
  const [row] = await db
    .insert(favorites)
    .values({ id: crypto.randomUUID(), userId, bookId })
    .onConflictDoNothing({ target: [favorites.userId, favorites.bookId] })
    .returning()
  return NextResponse.json(row ?? { userId, bookId })
}

export async function DELETE(req: Request) {
  const { userId, bookId } = await req.json()
  if (!userId || !bookId) {
    return NextResponse.json({ error: "Missing userId or bookId" }, { status: 400 })
  }
  await db
    .delete(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.bookId, bookId)))
  return NextResponse.json({ success: true })
}
