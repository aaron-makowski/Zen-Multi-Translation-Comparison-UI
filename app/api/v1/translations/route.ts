import { NextResponse } from "next/server"
<<<<<<< HEAD
import { translations } from "@/lib/translations"
=======
import { db } from "@/lib/db"
import { translations } from "@/lib/schema"
import { eq } from "drizzle-orm"
>>>>>>> origin/codex/build-rest-api-for-books-and-translations

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const verseId = searchParams.get("verseId")
<<<<<<< HEAD
  const bookId = searchParams.get("book") || "xinxinming"
  const book = (translations as Record<string, any>)[bookId]
  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 })
  }
  if (verseId) {
    const verse = book.verses.find((v: any) => v.id === Number(verseId))
    if (!verse) {
      return NextResponse.json({ error: "Verse not found" }, { status: 404 })
    }
    const list = verse.lines.flatMap((line: any) =>
      Object.entries(line.translations).map(([translator, text]) => ({
        translator,
        text,
      }))
    )
    return NextResponse.json(list)
  }
  return NextResponse.json(book.translators)
=======
  const result = verseId
    ? await db.select().from(translations).where(eq(translations.verseId, verseId))
    : await db.select().from(translations)
  return NextResponse.json(result)
}

export async function POST(req: Request) {
  const { text, translator, language, verseId } = await req.json()
  if (!text || !translator || !verseId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  const newTranslation = {
    id: crypto.randomUUID(),
    text,
    translator,
    language: language || "English",
    verseId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  await db.insert(translations).values(newTranslation)
  return NextResponse.json(newTranslation, { status: 201 })
>>>>>>> origin/codex/build-rest-api-for-books-and-translations
}
