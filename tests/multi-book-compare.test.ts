import { describe, it, expect } from 'vitest'

interface Translation { translator: string }
interface Verse { translations: Translation[] }
interface Book { id: string; verses: Verse[] }

function seedBooks(): Book[] {
  return [
    {
      id: 'book1',
      verses: [
        { translations: [{ translator: 'A' }, { translator: 'B' }] },
      ],
    },
    {
      id: 'book2',
      verses: [
        { translations: [{ translator: 'A' }, { translator: 'C' }] },
        { translations: [{ translator: 'B' }] },
      ],
    },
  ]
}

function aggregateBooks(books: Book[]) {
  const totalBooks = books.length
  const totalVerses = books.reduce((sum, b) => sum + b.verses.length, 0)
  const translatorCount: Record<string, number> = {}
  for (const book of books) {
    for (const verse of book.verses) {
      for (const tr of verse.translations) {
        translatorCount[tr.translator] = (translatorCount[tr.translator] || 0) + 1
      }
    }
  }
  return { totalBooks, totalVerses, translatorCount }
}

describe('multi-book comparison', () => {
  it('aggregates verses and translators across books', () => {
    const books = seedBooks()
    const result = aggregateBooks(books)
    expect(result.totalBooks).toBe(2)
    expect(result.totalVerses).toBe(3)
    expect(result.translatorCount).toEqual({ A: 2, B: 2, C: 1 })
  })
})
