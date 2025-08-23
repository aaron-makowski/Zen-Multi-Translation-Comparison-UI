import { describe, it, expect, vi, afterEach } from 'vitest'
import path from 'path'

describe('comments route caching', () => {
  afterEach(() => {
    vi.resetModules()
    vi.restoreAllMocks()
  })

  it('returns cached comments', async () => {
    const data = { verse1: [{ id: '1', content: 'hi', createdAt: '', votes: 0 }] }
    const redisPath = path.resolve(__dirname, '../lib/redis.ts')
    const get = vi.fn().mockResolvedValue(data)
    const set = vi.fn()
    vi.doMock(redisPath, () => ({ redis: { get, set } }))
    vi.doMock('fs', () => ({
      promises: { readFile: vi.fn(), writeFile: vi.fn(), mkdir: vi.fn() },
    }))
    const { GET } = await import('../app/api/comments/route')
    const res = await GET(new Request('http://test?verseId=verse1'))
    expect(await res.json()).toEqual(data.verse1)
    expect(get).toHaveBeenCalledWith('comments')
    expect(set).not.toHaveBeenCalled()
  })

  it('caches comments on miss', async () => {
    const data = { verse1: [{ id: '1', content: 'hi', createdAt: '', votes: 0 }] }
    const redisPath = path.resolve(__dirname, '../lib/redis.ts')
    const get = vi.fn().mockResolvedValue(null)
    const set = vi.fn()
    const readFile = vi.fn().mockResolvedValue(JSON.stringify(data))
    vi.doMock(redisPath, () => ({ redis: { get, set } }))
    vi.doMock('fs', () => ({
      promises: { readFile, writeFile: vi.fn(), mkdir: vi.fn() },
    }))
    const { GET } = await import('../app/api/comments/route')
    const res = await GET(new Request('http://test?verseId=verse1'))
    expect(await res.json()).toEqual(data.verse1)
    expect(readFile).toHaveBeenCalled()
    expect(set).toHaveBeenCalledWith('comments', data, { ex: 60 })
  })
})
