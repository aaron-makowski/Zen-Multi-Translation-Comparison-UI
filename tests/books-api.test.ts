import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    book: {
      findMany: vi.fn(),
    },
  },
}))

import { GET } from '../app/api/books/route'
import { prisma } from '@/lib/db'

describe('GET /api/books', () => {
  it('returns books with unique translators and verse metadata', async () => {
    const mockBooks = [
      {
        id: 'b1',
        title: 'Book 1',
        verses: [
          {
            id: 'v1',
            number: 1,
            translations: [
              { translator: 'T1' },
              { translator: 'T2' },
              { translator: 'T1' },
            ],
          },
        ],
      },
      {
        id: 'b2',
        title: 'Book 2',
        verses: [
          {
            id: 'v2',
            number: 1,
            translations: [{ translator: 'T3' }],
          },
        ],
      },
    ]

    ;(prisma.book.findMany as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockBooks)

    const res = await GET()
    const json = await res.json()

    expect(json).toEqual([
      {
        id: 'b1',
        title: 'Book 1',
        translators: ['T1', 'T2'],
        verses: [{ id: 'v1', number: 1 }],
      },
      {
        id: 'b2',
        title: 'Book 2',
        translators: ['T3'],
        verses: [{ id: 'v2', number: 1 }],
      },
    ])

    json.forEach((book: any) => {
      expect(book).toHaveProperty('id')
      expect(book).toHaveProperty('title')
      expect(book).toHaveProperty('translators')
      expect(book).toHaveProperty('verses')
      expect(new Set(book.translators).size).toBe(book.translators.length)
    })
  })
})
