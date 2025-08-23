<<<<<<< HEAD
import { describe, it, expect, vi, afterEach } from 'vitest'

const versesData = [
  { id: '1', bookId: 'b1', number: 1, text: 'v1' },
  { id: '2', bookId: 'b1', number: 2, text: 'v2' },
  { id: '3', bookId: 'b1', number: 3, text: 'v3' },
  { id: '4', bookId: 'b1', number: 4, text: 'v4' },
]

describe('verses route', () => {
  afterEach(() => {
    vi.resetModules()
    vi.restoreAllMocks()
  })

  const mockDb = () => ({
    db: {
      select: vi.fn(() => ({
        from: () => ({
          where: () => ({
            orderBy: () => ({
              limit: (l: number) => ({
                offset: (o: number) => Promise.resolve(versesData.slice(o, o + l)),
              }),
            }),
          }),
        }),
      })),
    },
  })

  it('returns paginated verses and caches result', async () => {
    const get = vi.fn().mockResolvedValue(null)
    const set = vi.fn()
    vi.doMock('@/lib/redis', () => ({ redis: { get, set } }))
    vi.doMock('@/lib/db', mockDb)
    vi.doMock('@/lib/schema', () => ({ verses: {} }))
    const { GET } = await import('../app/api/verses/route')
    const res = await GET(new Request('http://test?bookId=b1&page=2&limit=2'))
    const json = await res.json()
    expect(json).toEqual(versesData.slice(2, 4))
    expect(set).toHaveBeenCalledWith('verses:b1:2:2', versesData.slice(2, 4), { ex: 60 })
  })

  it('returns cached verses', async () => {
    const cached = versesData.slice(0, 2)
    const get = vi.fn().mockResolvedValue(cached)
    const set = vi.fn()
    vi.doMock('@/lib/redis', () => ({ redis: { get, set } }))
    vi.doMock('@/lib/db', mockDb)
    vi.doMock('@/lib/schema', () => ({ verses: {} }))
    const { GET } = await import('../app/api/verses/route')
    const res = await GET(new Request('http://test?bookId=b1&page=1&limit=2'))
    expect(await res.json()).toEqual(cached)
    expect(get).toHaveBeenCalled()
    expect(set).not.toHaveBeenCalled()
  })

  it('validates missing bookId', async () => {
    vi.doMock('@/lib/redis', () => ({ redis: undefined }))
    vi.doMock('@/lib/db', mockDb)
    vi.doMock('@/lib/schema', () => ({ verses: {} }))
    const { GET } = await import('../app/api/verses/route')
    const res = await GET(new Request('http://test'))
    expect(res.status).toBe(400)
  })

  it('rejects invalid pagination', async () => {
    vi.doMock('@/lib/redis', () => ({ redis: undefined }))
    vi.doMock('@/lib/db', mockDb)
    vi.doMock('@/lib/schema', () => ({ verses: {} }))
    const { GET } = await import('../app/api/verses/route')
    const res = await GET(new Request('http://test?bookId=b1&page=0'))
    expect(res.status).toBe(400)
=======
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
>>>>>>> origin/codex/integrate-postgresql-and-update-db.ts
  })
})
