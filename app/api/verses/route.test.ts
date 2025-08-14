import { describe, it, expect, beforeEach, vi } from 'vitest'

const sample = [
  { id: 'v1', bookId: 'b1', number: 1, text: 'alpha' },
  { id: 'v2', bookId: 'b1', number: 2, text: 'beta' },
  { id: 'v3', bookId: 'b1', number: 3, text: 'gamma' },
]

const findMany = vi.fn(({ limit, offset }) => sample.slice(offset, offset + limit))
vi.mock('@/lib/db', () => ({
  db: { query: { verses: { findMany } } }
}))
vi.mock('@/lib/schema', () => ({ translations: {}, verses: {} }))

const store = new Map<string, any>()
const get = vi.fn(async (key: string) => store.get(key))
const set = vi.fn(async (key: string, value: any) => { store.set(key, value) })
vi.mock('@/lib/redis', () => ({
  redis: { get, set }
}))

const { GET } = await import('./route')

beforeEach(() => {
  store.clear()
  vi.clearAllMocks()
})

describe('GET /api/verses', () => {
  it('paginates results', async () => {
    const req1 = new Request('http://test?bookId=b1&page=1&limit=2')
    const res1 = await GET(req1)
    const body1 = await res1.json()
    expect(body1).toEqual(sample.slice(0, 2))

    const req2 = new Request('http://test?bookId=b1&page=2&limit=2')
    const res2 = await GET(req2)
    const body2 = await res2.json()
    expect(body2).toEqual(sample.slice(2, 4))
  })

  it('caches responses for identical queries', async () => {
    const req = new Request('http://test?bookId=b1&page=1&limit=2')
    await GET(req)
    await GET(req)

    expect(get).toHaveBeenCalledTimes(2)
    expect(set).toHaveBeenCalledTimes(1)
    expect(findMany).toHaveBeenCalledTimes(1)
  })

  it('returns 400 if bookId missing', async () => {
    const req = new Request('http://test')
    const res = await GET(req)
    expect(res.status).toBe(400)
  })
})
