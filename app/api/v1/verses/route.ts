import { NextResponse } from "next/server"
<<<<<<< HEAD
import { unstable_cache } from "next/cache"
import { loadCachedTranslations } from "@/lib/verse-cache"

const getBook = unstable_cache(
  async (bookId: string) => {
    const data = await loadCachedTranslations()
    return (data as Record<string, any>)[bookId]
  },
  ["verses"],
  { revalidate: 3600, tags: ["verses"] }
)

export const revalidate = 3600

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const bookId = searchParams.get("book") || "xinxinming"
  const book = await getBook(bookId)
  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 })
  }
  return NextResponse.json(book.verses)
=======
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
>>>>>>> origin/codex/build-rest-api-for-books-and-translations
}
