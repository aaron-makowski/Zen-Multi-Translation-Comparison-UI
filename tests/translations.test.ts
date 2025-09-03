import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
<<<<<<< HEAD

let GET: any
let findMany: any
let redis: any

describe('translations API', () => {
  beforeEach(async () => {
    const data = [
      { id: 't1', verseId: 'v1', translator: 'a', text: 'A' },
      { id: 't2', verseId: 'v1', translator: 'b', text: 'B' },
      { id: 't3', verseId: 'v1', translator: 'c', text: 'C' }
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
    vi.mock('@/lib/db', () => ({ db: { query: { translations: { findMany } } } }))
    vi.mock('@/lib/schema', () => ({ translations: {} }))

    ;({ GET } = await import('../app/api/translations/route'))
  })

  afterEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('returns paginated translations and caches', async () => {
    const req = new Request('http://test/translations?verseId=v1&page=0&limit=2')
    const res1 = await GET(req)
    const data1 = await res1.json()
    expect(data1).toHaveLength(2)
    expect(findMany).toHaveBeenCalledTimes(1)

    const res2 = await GET(req)
    await res2.json()
    expect(findMany).toHaveBeenCalledTimes(1)
    expect(redis.get).toHaveBeenCalledTimes(2)
  })

  it('returns 400 for missing verseId', async () => {
    const res = await GET(new Request('http://test/translations'))
    expect(res.status).toBe(400)
  })

  it('returns empty array for out-of-bounds page', async () => {
    const res = await GET(new Request('http://test/translations?verseId=v1&page=10&limit=2'))
=======

let GET: any
let findMany: any
let redis: any

describe('translations API', () => {
  beforeEach(async () => {
    const data = [
      { id: 't1', verseId: 'v1', translator: 'a', text: 'A' },
      { id: 't2', verseId: 'v1', translator: 'b', text: 'B' },
      { id: 't3', verseId: 'v1', translator: 'c', text: 'C' }
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
    vi.mock('@/lib/db', () => ({ db: { query: { translations: { findMany } } } }))
    vi.mock('@/lib/schema', () => ({ translations: {} }))

    ;({ GET } = await import('../app/api/translations/route'))
  })

  afterEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('returns paginated translations and caches', async () => {
    const req = new Request('http://test/translations?verseId=v1&page=0&limit=2')
    const res1 = await GET(req)
    const data1 = await res1.json()
    expect(data1).toHaveLength(2)
    expect(findMany).toHaveBeenCalledTimes(1)

    const res2 = await GET(req)
    await res2.json()
    expect(findMany).toHaveBeenCalledTimes(1)
    expect(redis.get).toHaveBeenCalledTimes(2)
  })

  it('returns 400 for missing verseId', async () => {
    const res = await GET(new Request('http://test/translations'))
    expect(res.status).toBe(400)
  })

  it('returns empty array for out-of-bounds page', async () => {
    const res = await GET(new Request('http://test/translations?verseId=v1&page=10&limit=2'))
>>>>>>> origin/main
    const data = await res.json()
    expect(data).toEqual([])
  })
})
<<<<<<< HEAD
=======

>>>>>>> origin/main
