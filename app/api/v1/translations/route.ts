import { NextResponse } from "next/server"
import { unstable_cache } from "next/cache"
import { loadCachedTranslations } from "@/lib/verse-cache"

const getBook = unstable_cache(
  async () => {
    const data = await loadCachedTranslations()
    return data.xinxinming
  },
  ["translations"],
  { revalidate: 3600, tags: ["translations"] }
)

export const revalidate = 3600

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const verseId = searchParams.get("verseId")
  const book = await getBook()
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
