import { describe, it, expect, vi, afterEach } from 'vitest'

const translationsData = [
  { id: 't1', verseId: 'v1', translator: 'A', text: 'ta' },
  { id: 't2', verseId: 'v1', translator: 'B', text: 'tb' },
  { id: 't3', verseId: 'v1', translator: 'C', text: 'tc' },
]

describe('translations route', () => {
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
                offset: (o: number) => Promise.resolve(translationsData.slice(o, o + l)),
              }),
            }),
          }),
        }),
      })),
    },
  })

  it('returns paginated translations and caches result', async () => {
    const get = vi.fn().mockResolvedValue(null)
    const set = vi.fn()
    vi.doMock('@/lib/redis', () => ({ redis: { get, set } }))
    vi.doMock('@/lib/db', mockDb)
    vi.doMock('@/lib/schema', () => ({ translations: {} }))
    const { GET } = await import('../app/api/translations/route')
    const res = await GET(new Request('http://test?verseId=v1&page=2&limit=1'))
    const json = await res.json()
    expect(json).toEqual(translationsData.slice(1, 2))
    expect(set).toHaveBeenCalledWith('translations:v1:2:1', translationsData.slice(1, 2), { ex: 60 })
  })

  it('returns cached translations', async () => {
    const cached = translationsData.slice(0, 1)
    const get = vi.fn().mockResolvedValue(cached)
    const set = vi.fn()
    vi.doMock('@/lib/redis', () => ({ redis: { get, set } }))
    vi.doMock('@/lib/db', mockDb)
    vi.doMock('@/lib/schema', () => ({ translations: {} }))
    const { GET } = await import('../app/api/translations/route')
    const res = await GET(new Request('http://test?verseId=v1&page=1&limit=1'))
    expect(await res.json()).toEqual(cached)
    expect(get).toHaveBeenCalled()
    expect(set).not.toHaveBeenCalled()
  })

  it('validates missing verseId', async () => {
    vi.doMock('@/lib/redis', () => ({ redis: undefined }))
    vi.doMock('@/lib/db', mockDb)
    vi.doMock('@/lib/schema', () => ({ translations: {} }))
    const { GET } = await import('../app/api/translations/route')
    const res = await GET(new Request('http://test'))
    expect(res.status).toBe(400)
  })

  it('rejects invalid pagination', async () => {
    vi.doMock('@/lib/redis', () => ({ redis: undefined }))
    vi.doMock('@/lib/db', mockDb)
    vi.doMock('@/lib/schema', () => ({ translations: {} }))
    const { GET } = await import('../app/api/translations/route')
    const res = await GET(new Request('http://test?verseId=v1&page=abc'))
    expect(res.status).toBe(400)
  })
})
