import { VerseSelector } from "./verse-selector"
import { getAggregatedTranslations } from "@/lib/multi-verse"
import { Card } from "@/components/ui/card"

export default async function MultiComparePage({
  searchParams,
}: {
  searchParams: { pairs?: string }
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const res = await fetch(`${baseUrl}/api/books`)
  const books = await res.json()

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

  const data = pairs.length > 0 ? await getAggregatedTranslations(pairs) : null

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
