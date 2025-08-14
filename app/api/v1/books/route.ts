import { NextResponse } from "next/server"
<<<<<<< HEAD
import { translations } from "@/lib/translations"

const books = Object.entries(translations).map(([id, book]) => ({
  id,
  title: book.title,
  description: book.description,
  pdfPath: null as string | null,
}))

export async function GET() {
  return NextResponse.json(books)
=======
import { db } from "@/lib/db"
import { books } from "@/lib/schema"

export async function GET() {
  const allBooks = await db.select().from(books)
  return NextResponse.json(allBooks)
}

export async function POST(req: Request) {
  const { title, description, author, coverImage } = await req.json()
  if (!title || !description) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  const newBook = {
    id: crypto.randomUUID(),
    title,
    description,
    author,
    coverImage,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  await db.insert(books).values(newBook)
  return NextResponse.json(newBook, { status: 201 })
>>>>>>> origin/codex/build-rest-api-for-books-and-translations
}
