import { NextResponse } from "next/server"
import { translations } from "@/lib/translations"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const bookId = searchParams.get("book") || "xinxinming"
  const book = (translations as Record<string, any>)[bookId]
  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 })
  }
  return NextResponse.json(book.verses)
}
