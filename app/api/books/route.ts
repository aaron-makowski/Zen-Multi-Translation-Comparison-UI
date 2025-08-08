import { NextResponse } from "next/server"
import { translations } from "@/lib/translations"

export async function GET() {
  const books = Object.entries(translations).map(([id, book]) => ({
    id,
    title: book.title,
    description: book.description,
    translators: book.translators,
  }))
  return NextResponse.json(books)
}
