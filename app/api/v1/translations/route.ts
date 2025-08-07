import { NextResponse } from "next/server"
import { translations } from "@/lib/translations"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const verseId = searchParams.get("verseId")
  const book = translations.xinxinming
  if (verseId) {
    const verse = book.verses.find((v) => v.id === Number(verseId))
    if (!verse) {
      return NextResponse.json({ error: "Verse not found" }, { status: 404 })
    }
    const list = verse.lines.flatMap((line) =>
      Object.entries(line.translations).map(([translator, text]) => ({
        translator,
        text,
      }))
    )
    return NextResponse.json(list)
  }
  return NextResponse.json(book.translators)
}
