import { Card } from "@/components/ui/card"
import { prisma } from "@/lib/db"
import { getAggregatedTranslations, type AggregatedResult } from "@/lib/multi-verse"
import { VerseSelector } from "./verse-selector"
import { DownloadButton } from "./download-button"

interface PageProps {
  searchParams?: { pairs?: string }
}

export default async function MultiComparePage({ searchParams }: PageProps) {
  const pairsParam = searchParams?.pairs ? decodeURIComponent(searchParams.pairs) : ""
  const pairStrings = pairsParam ? pairsParam.split(",").filter(Boolean) : []

  const validPairs: { bookId: string; verseId: string }[] = []
  const invalidPairs: string[] = []

  for (const pair of pairStrings) {
    const [bookId, verseId] = pair.split(":")
    if (bookId && verseId) {
      validPairs.push({ bookId, verseId })
    } else {
      invalidPairs.push(pair)
    }
  }

  const books = await prisma.book.findMany({
    orderBy: { title: "asc" },
    include: {
      verses: {
        orderBy: { number: "asc" },
        select: { id: true, number: true },
      },
    },
  })

  let data: AggregatedResult = { translations: {}, missing: [] }
  if (validPairs.length > 0) {
    data = await getAggregatedTranslations(validPairs)
  }

  const hasResults = Object.keys(data.translations).length > 0

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="max-w-4xl w-full space-y-6">
        <h1 className="text-3xl font-bold">Compare Multiple Verses</h1>

        <Card className="p-6">
          <VerseSelector
            books={books}
            initialPairs={validPairs.length > 0 ? validPairs : undefined}
          />
        </Card>

        {invalidPairs.length > 0 && (
          <p className="text-red-500">Some verse selections were invalid.</p>
        )}
        {data.missing.length > 0 && (
          <p className="text-red-500">Some requested verses could not be found.</p>
        )}

        {hasResults && (
          <>
            <div>
              <DownloadButton data={data} />
            </div>
            <div className="space-y-8">
              {Object.entries(data.translations).map(([bookTitle, translators]) => (
                <div key={bookTitle}>
                  <h2 className="text-xl font-semibold mb-2">{bookTitle}</h2>
                  {Object.entries(translators).map(([translator, verses]) => (
                    <div key={translator} className="mb-4">
                      <h3 className="font-medium">{translator}</h3>
                      <div className="space-y-2">
                        {verses.map((v) => (
                          <div key={v.verseId}>
                            <p className="font-semibold">Verse {v.verseNumber}</p>
                            <p className="whitespace-pre-line">{v.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
