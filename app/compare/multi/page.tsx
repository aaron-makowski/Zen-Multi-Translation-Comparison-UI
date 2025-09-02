import { db } from "@/lib/db"
import { verses } from "@/lib/schema"
import { inArray, asc } from "drizzle-orm"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default async function MultiComparePage({
  searchParams,
}: {
  searchParams: { ids?: string | string[] }
}) {
  // Fetch all books with their verses for the selection UI
  const allBooks = await db.query.books.findMany({
    with: {
      verses: {
        orderBy: (v, { asc }) => [asc(v.number)],
      },
    },
  })

  // Normalize the ids search param into an array, supporting comma-separated values
  const idsParam = searchParams?.ids
  const verseIds = Array.isArray(idsParam)
    ? idsParam.flatMap((v) => v.split(",").filter(Boolean))
    : typeof idsParam === "string"
    ? idsParam.split(",").filter(Boolean)
    : []

  // Fetch selected verses with their translations
  const selectedVerses = verseIds.length
    ? await db.query.verses.findMany({
        where: inArray(verses.id, verseIds),
        with: {
          book: true,
          translations: {
            orderBy: (t, { asc }) => [asc(t.translator)],
          },
        },
        orderBy: (v, { asc }) => [asc(v.bookId), asc(v.number)],
      })
    : []

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold mb-6">Compare Multiple Verses</h1>

        <Card className="p-6 mb-8">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Verses</label>
              <select
                name="ids"
                multiple
                size={10}
                defaultValue={verseIds}
                className="w-full border rounded p-2 h-48"
              >
                {allBooks.map((book) => (
                  <optgroup key={book.id} label={book.title}>
                    {book.verses.map((verse) => (
                      <option key={verse.id} value={verse.id}>
                        Verse {verse.number}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <Button type="submit">Compare</Button>
          </form>
        </Card>

        {selectedVerses.map((verse) => (
          <Card key={verse.id} className="p-6 mb-4">
            <h2 className="text-xl font-semibold mb-4">
              {verse.book.title} - Verse {verse.number}
            </h2>
            <div className="space-y-4">
              {verse.translations.map((t) => (
                <div key={t.id} className="border-b pb-2 last:border-0 last:pb-0">
                  <h3 className="font-medium">{t.translator}</h3>
                  <p className="whitespace-pre-line">{t.text}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </main>
  )
}
