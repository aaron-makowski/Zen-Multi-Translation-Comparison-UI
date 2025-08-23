import { NextResponse } from "next/server"
import { translations } from "@/lib/translations"

export async function GET(
  req: Request,
  { params }: { params: { bookId: string } }
) {
  const book = (translations as Record<string, any>)[params.bookId]
  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 })
  }
  return NextResponse.json(book.verses)
}
