import { VerseSelector } from "./verse-selector"
import { prisma } from "@/lib/db"
import { Card } from "@/components/ui/card"
import { DownloadButton, MultiVerseData } from "./download-button"

export default async function MultiComparePage({
  searchParams,
}: {
  searchParams: { pairs?: string }
}) {
  const books = await prisma.book.findMany({
    orderBy: { title: "asc" },
    include: {
      verses: {
        orderBy: { number: "asc" },
        select: { id: true, number: true },
      },
    },
  })

  const rawPairs = searchParams.pairs?.split(",") ?? []
  const pairs: { bookId: string; verseId: string }[] = []
  let invalid = false

  for (const p of rawPairs) {
    if (!p) continue
    const parts = p.split(":")
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      invalid = true
      continue
    }
    pairs.push({ bookId: parts[0], verseId: parts[1] })
  }

  let data: MultiVerseData | null = null

  if (pairs.length > 0) {
    const verseIds = pairs.map((p) => p.verseId)
    const verses = await prisma.verse.findMany({
      where: { id: { in: verseIds } },
      include: {
        book: true,
        translations: { orderBy: { translator: "asc" } },
      },
    })

    const translations: MultiVerseData["translations"] = {}

    for (const verse of verses) {
      const bookTitle = verse.book.title
      if (!translations[bookTitle]) {
        translations[bookTitle] = {}
      }
      for (const t of verse.translations) {
        if (!translations[bookTitle][t.translator]) {
          translations[bookTitle][t.translator] = []
        }
        translations[bookTitle][t.translator].push({
          verseId: verse.id,
          verseNumber: verse.number,
          text: t.text,
        })
      }
    }

    const foundIds = new Set(verses.map((v) => v.id))
    const missing = verseIds.filter((id) => !foundIds.has(id))

    data = { translations, missing }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold mb-6">Compare Multiple Verses</h1>
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Verses</h2>
          <VerseSelector books={books} initialPairs={pairs} />
        </Card>
        {invalid && (
          <p className="text-sm text-red-500 mb-4">Some verse selections were invalid and have been ignored.</p>
        )}
        {data && (
          <div className="space-y-8">
            {data.missing.length > 0 && (
              <p className="text-sm text-red-500">
                Some requested verses could not be found and were omitted.
              </p>
            )}
            <div className="flex justify-end">
              <DownloadButton data={data} />
            </div>
            {Object.entries(data.translations).map(([bookTitle, translators]) => (
              <div key={bookTitle}>
                <h2 className="text-2xl font-semibold mb-4">{bookTitle}</h2>
                {Object.entries(translators).map(([translator, verses]) => (
                  <div key={translator} className="mb-6">
                    <h3 className="text-xl font-medium mb-2">{translator}</h3>
                    {verses.map((v) => (
                      <div key={v.verseId} className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">Verse {v.verseNumber}</p>
                        <p>{v.text}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
