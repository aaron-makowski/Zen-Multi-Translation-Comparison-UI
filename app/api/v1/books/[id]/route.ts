import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { books } from "@/lib/schema"
import { eq } from "drizzle-orm"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const book = await db.query.books.findFirst({
    where: eq(books.id, params.id),
    with: {
      verses: {
        with: { translations: true },
      },
    },
  })
  if (!book) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  return NextResponse.json(book)
}
