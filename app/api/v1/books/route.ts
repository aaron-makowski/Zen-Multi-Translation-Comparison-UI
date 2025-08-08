import { NextResponse } from "next/server"
import { translations } from "@/lib/translations"

const books = Object.entries(translations).map(([id, book]) => ({
  id,
  title: book.title,
  description: book.description,
  pdfPath: null as string | null,
}))

export async function GET() {
  return NextResponse.json(books)
}
