import { describe, it, expect, vi, afterEach } from 'vitest'
import { GET } from '../app/api/reddit/route'

describe('reddit api route', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns formatted posts from reddit', async () => {
    const mockResponse = {
      data: {
        children: [
          { data: { id: '1', title: 't1', author: 'a1', permalink: '/r/test1', ups: 10 } },
          { data: { id: '2', title: 't2', author: 'a2', permalink: '/r/test2', ups: 5 } },
        ],
      },
    }

    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as any)

    const req = new Request('http://localhost/api/reddit?subreddit=test')
    const res = await GET(req)
    const posts = await res.json()

    expect(posts).toEqual([
      { id: '1', title: 't1', author: 'a1', url: 'https://www.reddit.com/r/test1', upvotes: 10 },
      { id: '2', title: 't2', author: 'a2', url: 'https://www.reddit.com/r/test2', upvotes: 5 },
    ])
  })

  it('handles error response', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({ ok: false, status: 404 } as any)

    const req = new Request('http://localhost/api/reddit?subreddit=test')
    const res = await GET(req)
    const body = await res.json()

    expect(res.status).toBe(404)
    expect(body.error).toBe('Failed to fetch posts')
  })
})
