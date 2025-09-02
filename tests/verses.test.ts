import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

let GET: any
let findMany: any
let redis: any

describe('verses API', () => {
  beforeEach(async () => {
    const data = [
      { id: 'v1', bookId: 'b1', number: 1, text: 'one' },
      { id: 'v2', bookId: 'b1', number: 2, text: 'two' },
      { id: 'v3', bookId: 'b1', number: 3, text: 'three' }
    ]
    findMany = vi.fn(({ limit, offset }: any) => data.slice(offset, offset + limit))

    const store = new Map<string, any>()
    redis = {
      get: vi.fn(async (k: string) => store.get(k)),
      set: vi.fn(async (k: string, v: any) => {
        store.set(k, v)
      })
    }
    vi.mock('@upstash/redis', () => ({ Redis: { fromEnv: () => redis } }))
    vi.mock('@/lib/db', () => ({ db: { query: { verses: { findMany } } } }))
    vi.mock('@/lib/schema', () => ({ verses: {} }))

    ;({ GET } = await import('../app/api/verses/route'))
  })

  afterEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('returns paginated verses and caches', async () => {
    const req = new Request('http://test/verses?bookId=b1&page=0&limit=2')
    const res1 = await GET(req)
    const data1 = await res1.json()
    expect(data1).toHaveLength(2)
    expect(findMany).toHaveBeenCalledTimes(1)

    const res2 = await GET(req)
    await res2.json()
    expect(findMany).toHaveBeenCalledTimes(1)
    expect(redis.get).toHaveBeenCalledTimes(2)
  })

  it('returns 400 for missing bookId', async () => {
    const res = await GET(new Request('http://test/verses'))
    expect(res.status).toBe(400)
  })

  it('returns empty array for out-of-bounds page', async () => {
    const res = await GET(new Request('http://test/verses?bookId=b1&page=10&limit=2'))
    const data = await res.json()
    expect(data).toEqual([])
  })
})
