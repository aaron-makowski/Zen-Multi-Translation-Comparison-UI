import { prisma } from "./db"

interface VersePair {
  bookId: string
  verseId: string
}

interface AggregatedTranslation {
  verseId: string
  verseNumber: number
  text: string
}

export interface AggregatedResult {
  translations: {
    [bookTitle: string]: {
      [translator: string]: AggregatedTranslation[]
    }
  }
  missing: string[]
}

export async function getAggregatedTranslations(pairs: VersePair[]): Promise<AggregatedResult> {
  const verseIds = pairs.map((p) => p.verseId)
  const verses = await prisma.verse.findMany({
    where: {
      id: { in: verseIds },
    },
    include: {
      book: true,
      translations: {
        orderBy: { translator: "asc" },
      },
    },
  })

  const translations: AggregatedResult["translations"] = {}
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

  return { translations, missing }
}
