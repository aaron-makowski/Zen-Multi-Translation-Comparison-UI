import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  const books = await prisma.book.findMany({
    orderBy: { title: "asc" },
    include: {
      verses: {
        orderBy: { number: "asc" },
        include: { translations: { select: { translator: true } } },
      },
    },
  })

  const data = books.map((b) => ({
    id: b.id,
    title: b.title,
    translators: Array.from(
      new Set(
        b.verses.flatMap((v) => v.translations.map((t) => t.translator))
      )
    ),
    verses: b.verses.map((v) => ({ id: v.id, number: v.number })),
  }))

  return NextResponse.json(data)
}
}
