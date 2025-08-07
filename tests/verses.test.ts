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
  })
})
