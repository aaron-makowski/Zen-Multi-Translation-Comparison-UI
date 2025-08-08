import { describe, it, expect } from 'vitest'
import { GET as getVerses } from '../../../app/api/books/[bookId]/verses/route'

describe('GET /api/books/[bookId]/verses', () => {
  it('returns verses for an existing book', async () => {
    const res = await getVerses(new Request('http://localhost'), { params: { bookId: 'xinxinming' } })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(Array.isArray(json)).toBe(true)
    expect(json[0]).toHaveProperty('id')
  })

  it('returns 404 for a missing book', async () => {
    const res = await getVerses(new Request('http://localhost'), { params: { bookId: 'unknown' } })
    expect(res.status).toBe(404)
    const json = await res.json()
    expect(json).toEqual({ error: 'Book not found' })
  })
})
