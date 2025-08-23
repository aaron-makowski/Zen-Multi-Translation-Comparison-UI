import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/lib/schema', () => ({
  verses: {},
}))

vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    query: { verses: { findFirst: vi.fn() } },
  },
}))

import { db } from '@/lib/db'
const select = db.select as any
const insert = db.insert as any
const query = db.query as any

import { GET, POST } from '../verses/route'
import { GET as GET_BY_ID } from '../verses/[id]/route'

describe('verses API', () => {
  beforeEach(() => {
    select.mockReset()
    insert.mockReset()
    query.verses.findFirst.mockReset()
  })

  it('GET returns all verses', async () => {
    select.mockReturnValue({
      from: vi.fn().mockResolvedValue([{ id: 'v1', number: 1, bookId: 'b1' }])
    })
    const res = await GET(new Request('http://example.com'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual([{ id: 'v1', number: 1, bookId: 'b1' }])
  })

  it('POST creates new verse', async () => {
    insert.mockReturnValue({ values: vi.fn().mockResolvedValue(undefined) })
    const req = new Request('http://example.com', {
      method: 'POST',
      body: JSON.stringify({ number: 1, bookId: 'b1' })
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.number).toBe(1)
  })

  it('POST missing fields returns 400', async () => {
    const req = new Request('http://example.com', {
      method: 'POST',
      body: JSON.stringify({ number: 1 })
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('GET by id returns verse', async () => {
    query.verses.findFirst.mockResolvedValue({ id: 'v1', translations: [] })
    const res = await GET_BY_ID(new Request('http://example.com'), { params: { id: 'v1' } })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ id: 'v1', translations: [] })
  })

  it('GET by id returns 404 for missing verse', async () => {
    query.verses.findFirst.mockResolvedValue(undefined)
    const res = await GET_BY_ID(new Request('http://example.com'), { params: { id: 'missing' } })
    expect(res.status).toBe(404)
  })
})

