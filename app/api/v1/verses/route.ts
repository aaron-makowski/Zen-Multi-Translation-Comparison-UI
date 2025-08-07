import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verses } from "@/lib/schema"
import { eq } from "drizzle-orm"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const bookId = searchParams.get("bookId")
  const result = bookId
    ? await db.select().from(verses).where(eq(verses.bookId, bookId))
    : await db.select().from(verses)
  return NextResponse.json(result)
}

export async function POST(req: Request) {
  const { number, bookId } = await req.json()
  if (!number || !bookId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  const newVerse = {
    id: crypto.randomUUID(),
    number,
    bookId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  await db.insert(verses).values(newVerse)
  return NextResponse.json(newVerse, { status: 201 })
}
