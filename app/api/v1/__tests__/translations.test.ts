import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/lib/schema', () => ({
  translations: {},
}))

vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    query: { translations: { findFirst: vi.fn() } },
  },
}))

import { db } from '@/lib/db'
const select = db.select as any
const insert = db.insert as any
const query = db.query as any

import { GET, POST } from '../translations/route'
import { GET as GET_BY_ID } from '../translations/[id]/route'

describe('translations API', () => {
  beforeEach(() => {
    select.mockReset()
    insert.mockReset()
    query.translations.findFirst.mockReset()
  })

  it('GET returns translations for a verse', async () => {
    select.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([
          { id: 't1', text: 'hi', translator: 'me', verseId: 'v1' }
        ])
      })
    })
    const req = new Request('http://example.com?verseId=v1')
    const res = await GET(req)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual([
      { id: 't1', text: 'hi', translator: 'me', verseId: 'v1' }
    ])
  })

  it('POST creates new translation', async () => {
    insert.mockReturnValue({ values: vi.fn().mockResolvedValue(undefined) })
    const req = new Request('http://example.com', {
      method: 'POST',
      body: JSON.stringify({ text: 'hi', translator: 'me', verseId: 'v1', language: 'en' })
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.text).toBe('hi')
  })

  it('POST missing fields returns 400', async () => {
    const req = new Request('http://example.com', {
      method: 'POST',
      body: JSON.stringify({ text: 'hi' })
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('GET by id returns translation', async () => {
    query.translations.findFirst.mockResolvedValue({ id: 't1' })
    const res = await GET_BY_ID(new Request('http://example.com'), { params: { id: 't1' } })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ id: 't1' })
  })

  it('GET by id returns 404 for missing translation', async () => {
    query.translations.findFirst.mockResolvedValue(undefined)
    const res = await GET_BY_ID(new Request('http://example.com'), { params: { id: 'missing' } })
    expect(res.status).toBe(404)
  })
})

