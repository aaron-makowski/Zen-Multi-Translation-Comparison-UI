import { describe, it, expect } from 'vitest'

interface TranslationVerse {
  translations: Record<string, string>
}

interface Book {
  title: string
  verses: TranslationVerse[]
}

function seedBooks(): Book[] {
  return [
    {
      title: 'Book A',
      verses: [
        { translations: { a: '1', b: '2' } },
        { translations: { a: '3' } }
      ]
    },
    {
      title: 'Book B',
      verses: [
        { translations: { a: '1', b: '2', c: '3' } },
        { translations: { a: '4' } }
      ]
    }
  ]
}

function aggregateBooks(books: Book[]) {
  return books.map((book) => ({
    title: book.title,
    verseCount: book.verses.length,
    translationCount: book.verses.reduce((sum, v) => sum + Object.keys(v.translations).length, 0)
  }))
}

describe('multi-book comparison', () => {
  it('aggregates data across books', () => {
    const books = seedBooks()
    const summary = aggregateBooks(books)

    expect(summary).toEqual([
      { title: 'Book A', verseCount: 2, translationCount: 3 },
      { title: 'Book B', verseCount: 2, translationCount: 4 }
    ])

    const totalTranslations = summary.reduce((sum, b) => sum + b.translationCount, 0)
    expect(totalTranslations).toBe(7)
  })
})
