import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { books } from "@/lib/schema"

export async function GET() {
  const allBooks = await db.query.books.findMany()
  return NextResponse.json(allBooks)
}

export async function POST(req: Request) {
  const { title, description, author, coverImage } = await req.json()
  if (!title || !description) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  const [book] = await db
    .insert(books)
    .values({
      id: crypto.randomUUID(),
      title,
      description,
      author,
      coverImage,
      updatedAt: new Date(),
    })
    .returning()
  return NextResponse.json(book, { status: 201 })
}
