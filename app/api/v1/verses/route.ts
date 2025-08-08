import { NextResponse } from "next/server"
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
}
