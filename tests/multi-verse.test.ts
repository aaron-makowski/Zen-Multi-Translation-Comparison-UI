import { describe, it, expect, vi } from 'vitest'

vi.mock('../lib/db', () => ({
  prisma: {
    verse: {
      findMany: vi.fn(),
    },
  },
}))

import { getAggregatedTranslations } from '../lib/multi-verse'
import { prisma } from '../lib/db'

describe('getAggregatedTranslations', () => {
  it('groups translations by book and translator', async () => {
    const mockVerses = [
      {
        id: 'v1',
        number: 1,
        book: { title: 'Book One' },
        translations: [
          { translator: 'T1', text: 'text1' },
          { translator: 'T2', text: 'text2' },
        ],
      },
      {
        id: 'v2',
        number: 2,
        book: { title: 'Book Two' },
        translations: [
          { translator: 'T1', text: 'text3' },
        ],
      },
    ]

    ;(prisma.verse.findMany as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockVerses)

    const result = await getAggregatedTranslations([
      { bookId: 'b1', verseId: 'v1' },
      { bookId: 'b2', verseId: 'v2' },
    ])

    expect(result).toEqual({
      translations: {
        'Book One': {
          T1: [{ verseId: 'v1', verseNumber: 1, text: 'text1' }],
          T2: [{ verseId: 'v1', verseNumber: 1, text: 'text2' }],
        },
        'Book Two': {
          T1: [{ verseId: 'v2', verseNumber: 2, text: 'text3' }],
        },
      },
      missing: [],
    })
  })

  it('reports verseIds that are not found', async () => {
    const mockVerses = [
      {
        id: 'v1',
        number: 1,
        book: { title: 'Book One' },
        translations: [{ translator: 'T1', text: 'text1' }],
      },
    ]

    ;(prisma.verse.findMany as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockVerses)

    const result = await getAggregatedTranslations([
      { bookId: 'b1', verseId: 'v1' },
      { bookId: 'b2', verseId: 'missing' },
    ])

    expect(result.translations).toEqual({
      'Book One': {
        T1: [{ verseId: 'v1', verseNumber: 1, text: 'text1' }],
      },
    })
    expect(result.missing).toEqual(['missing'])
  })
})
