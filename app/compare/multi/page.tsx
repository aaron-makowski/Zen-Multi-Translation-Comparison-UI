import { MultiVerseSelector } from "@/components/multi-verse-selector"
import { db } from "@/lib/db"
import { books, verses as versesTable, translations } from "@/lib/schema"
import { asc, inArray } from "drizzle-orm"

export default async function MultiComparePage({
  searchParams,
}: {
  searchParams?: { verses?: string }
}) {
  const verseIds = searchParams?.verses?.split(",").filter(Boolean) || []

  const allBooks = await db.query.books.findMany({
    orderBy: (books, { asc }) => [asc(books.title)],
    with: {
      verses: {
        orderBy: (versesTable, { asc }) => [asc(versesTable.number)],
      },
    },
  })

  let selectedVerses: {
    id: string
    number: number
    book: { id: string; title: string }
    translations: { id: string; translator: string; text: string }[]
  }[] = []

  if (verseIds.length > 0) {
    selectedVerses = await db.query.verses.findMany({
      where: inArray(versesTable.id, verseIds),
      with: {
        book: true,
        translations: {
          orderBy: (translations, { asc }) => [asc(translations.translator)],
        },
      },
    })

    selectedVerses.sort(
      (a, b) => a.book.title.localeCompare(b.book.title) || a.number - b.number,
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold mb-6">Compare Multiple Verses</h1>

        <MultiVerseSelector books={allBooks} initialSelected={verseIds} />

        <div className="space-y-8">
          {selectedVerses.map((verse) => (
            <div key={verse.id}>
              <h2 className="text-xl font-semibold mb-4">
                {verse.book.title} - Verse {verse.number}
              </h2>
              <div className="space-y-4">
                {verse.translations.map((t) => (
                  <div
                    key={t.id}
                    className="border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <h3 className="font-medium">{t.translator}</h3>
                    <p className="whitespace-pre-line">{t.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
