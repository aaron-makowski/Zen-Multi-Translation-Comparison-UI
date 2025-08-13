import verseAlignment from "@/data/verse-alignment.json"
import { translations } from "./translations"

// Type for alignment mapping
export type VerseAlignment = Record<string, Record<string, number>>

const alignment: VerseAlignment = verseAlignment as VerseAlignment

// Look up the mapping for a given translator's verse number
export function getMappedVerse(
  translator: string,
  verseNumber: number
): { baseVerse: number; mapping: Record<string, number> } | null {
  for (const [base, map] of Object.entries(alignment)) {
    if (map[translator] === verseNumber) {
      return { baseVerse: Number(base), mapping: map }
    }
  }
  return null
}

// Filter translations by a keyword across translators
export function filterByKeyword(keyword: string) {
  const lower = keyword.toLowerCase().trim()
  if (!lower) return []
  const results: { baseVerse: number; translator: string; text: string }[] = []

  const verses = translations.xinxinming.verses
  for (const verse of verses) {
    for (const line of verse.lines) {
      for (const [translator, text] of Object.entries(line.translations)) {
        if (text.toLowerCase().includes(lower)) {
          const mapped = getMappedVerse(translator, verse.id)
          results.push({
            baseVerse: mapped?.baseVerse ?? verse.id,
            translator,
            text,
          })
        }
      }
    }
  }

  return results
}
