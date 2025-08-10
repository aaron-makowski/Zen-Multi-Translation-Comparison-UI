import { NextResponse } from "next/server"
import { translations } from "@/lib/translations"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const verseId = searchParams.get("verseId")
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
}
