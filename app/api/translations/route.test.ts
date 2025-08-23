import { describe, it, expect, beforeEach, vi } from 'vitest'

// sample data for translations
const sample = [
  { id: 't1', verseId: '1', translator: 'A', text: 'one' },
  { id: 't2', verseId: '1', translator: 'B', text: 'two' },
  { id: 't3', verseId: '1', translator: 'C', text: 'three' },
]

// mock database
const findMany = vi.fn(({ limit, offset }) => sample.slice(offset, offset + limit))
vi.mock('@/lib/db', () => ({
  db: { query: { translations: { findMany } } }
}))
vi.mock('@/lib/schema', () => ({ translations: {}, verses: {} }))

// mock redis with in-memory store to verify caching
const store = new Map<string, any>()
const get = vi.fn(async (key: string) => store.get(key))
const set = vi.fn(async (key: string, value: any) => { store.set(key, value) })
vi.mock('@/lib/redis', () => ({
  redis: { get, set }
}))

// import the handler after mocks are set up
const { GET } = await import('./route')

beforeEach(() => {
  store.clear()
  vi.clearAllMocks()
})

describe('GET /api/translations', () => {
  it('paginates results', async () => {
    const req1 = new Request('http://test?verseId=1&page=1&limit=2')
    const res1 = await GET(req1)
    const body1 = await res1.json()
    expect(body1).toEqual(sample.slice(0, 2))

    const req2 = new Request('http://test?verseId=1&page=2&limit=2')
    const res2 = await GET(req2)
    const body2 = await res2.json()
    expect(body2).toEqual(sample.slice(2, 4))
  })

  it('caches responses for identical queries', async () => {
    const req = new Request('http://test?verseId=1&page=1&limit=2')
    await GET(req)
    await GET(req)

    expect(get).toHaveBeenCalledTimes(2)
    expect(set).toHaveBeenCalledTimes(1)
    expect(findMany).toHaveBeenCalledTimes(1)
  })

  it('returns 400 if verseId missing', async () => {
    const req = new Request('http://test')
    const res = await GET(req)
    expect(res.status).toBe(400)
  })
})
