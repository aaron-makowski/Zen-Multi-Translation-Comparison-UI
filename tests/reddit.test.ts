import { describe, it, expect, vi, afterEach } from 'vitest'
import path from 'path'

const cacheKey = 'reddit:test'

describe('reddit route', () => {
  afterEach(() => {
    vi.resetModules()
    vi.restoreAllMocks()
  })

  it('returns cached posts', async () => {
    const posts = [{ id: '1', title: 't', author: 'a', url: 'u', upvotes: 1 }]
    const get = vi.fn().mockResolvedValue(posts)
    const set = vi.fn()
    const redisPath = path.resolve(__dirname, '../lib/redis.ts')
    vi.doMock(redisPath, () => ({ redis: { get, set } }))
    const fetch = vi.fn()
    // @ts-ignore
    global.fetch = fetch
    const { GET } = await import('../app/api/reddit/route')
    const res = await GET(new Request('http://test?subreddit=test'))
    expect(await res.json()).toEqual(posts)
    expect(get).toHaveBeenCalledWith(cacheKey)
    expect(set).not.toHaveBeenCalled()
    expect(fetch).not.toHaveBeenCalled()
  })

  it('caches posts on miss', async () => {
    const posts = [{ id: '1', title: 't', author: 'a', url: 'https://www.reddit.com/p', upvotes: 1 }]
    const get = vi.fn().mockResolvedValue(null)
    const set = vi.fn()
    const redisPath = path.resolve(__dirname, '../lib/redis.ts')
    vi.doMock(redisPath, () => ({ redis: { get, set } }))
    const fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { children: [{ data: { id: '1', title: 't', author: 'a', permalink: '/p', ups: 1 } }] } })
    })
    // @ts-ignore
    global.fetch = fetch
    const { GET } = await import('../app/api/reddit/route')
    const res = await GET(new Request('http://test?subreddit=test'))
    expect(await res.json()).toEqual(posts)
    expect(get).toHaveBeenCalledWith(cacheKey)
    expect(fetch).toHaveBeenCalled()
    expect(set).toHaveBeenCalledWith(cacheKey, posts, { ex: 300 })
  })
})
