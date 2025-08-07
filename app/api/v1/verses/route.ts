import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verses } from "@/lib/schema"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const bookId = searchParams.get("bookId")
  if (bookId) {
    const byBook = await db.query.verses.findMany({
      where: (verses, { eq }) => eq(verses.bookId, bookId),
    })
    return NextResponse.json(byBook)
  }
  const allVerses = await db.query.verses.findMany()
  return NextResponse.json(allVerses)
}

export async function POST(req: Request) {
  const { number, bookId } = await req.json()
  if (typeof number !== "number" || !bookId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  const [verse] = await db
    .insert(verses)
    .values({ id: crypto.randomUUID(), number, bookId, updatedAt: new Date() })
    .returning()
  return NextResponse.json(verse, { status: 201 })
}
