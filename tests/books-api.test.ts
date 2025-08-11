import { describe, it, expect, vi } from 'vitest'

vi.mock('../lib/db', () => ({
  prisma: {
    book: { findMany: vi.fn() },
    verse: { findMany: vi.fn() }
  }
}))

import { GET as getBooks } from '../app/api/books/route'
import { GET as getVerses } from '../app/api/books/[bookId]/verses/route'
import { GET as getPdf } from '../app/api/books/[bookId]/pdf/route'
import { prisma } from '../lib/db'

describe('books API', () => {
  it('lists books', async () => {
    ;(prisma.book.findMany as any).mockResolvedValue([{ id: 'b1', title: 'Book', description: 'Desc' }])
    const res = await getBooks()
    const body = await res.json()
    expect(body).toEqual([{ id: 'b1', title: 'Book', description: 'Desc' }])
  })

  it('lists verses for a book', async () => {
    ;(prisma.verse.findMany as any).mockResolvedValue([{ id: 'v1', number: 1, bookId: 'b1' }])
    const res = await getVerses(new Request('http://test'), { params: { bookId: 'b1' } })
    const body = await res.json()
    expect(body).toEqual([{ id: 'v1', number: 1, bookId: 'b1' }])
  })

  it('returns a PDF for a book', async () => {
    ;(prisma.verse.findMany as any).mockResolvedValue([{ number: 1 }, { number: 2 }])
    const res = await getPdf(new Request('http://test'), { params: { bookId: 'b1' } })
    expect(res.headers.get('content-type')).toBe('application/pdf')
    const text = await res.text()
    expect(text).toBe('Verse 1\nVerse 2')
  })
})
