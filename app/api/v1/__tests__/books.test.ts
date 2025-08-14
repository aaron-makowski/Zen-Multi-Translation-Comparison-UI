import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/lib/schema', () => ({
  books: {},
}))

vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    query: { books: { findFirst: vi.fn() } },
  },
}))

import { db } from '@/lib/db'
const select = db.select as any
const insert = db.insert as any
const query = db.query as any

import { GET, POST } from '../books/route'
import { GET as GET_BY_ID } from '../books/[id]/route'

describe('books API', () => {
  beforeEach(() => {
    select.mockReset()
    insert.mockReset()
    query.books.findFirst.mockReset()
  })

  it('GET returns all books', async () => {
    select.mockReturnValue({
      from: vi.fn().mockResolvedValue([{ id: '1', title: 'Genesis', description: 'desc' }])
    })
    const res = await GET()
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual([{ id: '1', title: 'Genesis', description: 'desc' }])
  })

  it('POST creates new book', async () => {
    insert.mockReturnValue({ values: vi.fn().mockResolvedValue(undefined) })
    const req = new Request('http://example.com', {
      method: 'POST',
      body: JSON.stringify({ title: 'G', description: 'd', author: 'a', coverImage: 'c' })
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.title).toBe('G')
  })

  it('POST missing fields returns 400', async () => {
    const req = new Request('http://example.com', {
      method: 'POST',
      body: JSON.stringify({ title: 'OnlyTitle' })
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('GET by id returns book', async () => {
    query.books.findFirst.mockResolvedValue({ id: '1' })
    const res = await GET_BY_ID(new Request('http://example.com'), { params: { id: '1' } })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ id: '1' })
  })

  it('GET by id returns 404 for missing book', async () => {
    query.books.findFirst.mockResolvedValue(undefined)
    const res = await GET_BY_ID(new Request('http://example.com'), { params: { id: '2' } })
    expect(res.status).toBe(404)
  })
})

