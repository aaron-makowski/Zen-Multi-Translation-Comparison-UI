import { describe, it, expect } from 'vitest'
import { GET as getBooks } from '../../../app/api/books/route'

describe('GET /api/books', () => {
  it('lists available books with expected fields', async () => {
    const res = await getBooks()
    const json = await res.json()
    expect(Array.isArray(json)).toBe(true)
    expect(json.length).toBeGreaterThan(0)
    const book = json[0]
    expect(book).toHaveProperty('id')
    expect(book).toHaveProperty('title')
    expect(book).toHaveProperty('description')
    expect(book).toHaveProperty('translators')
    expect(Array.isArray(book.translators)).toBe(true)
  })
})
