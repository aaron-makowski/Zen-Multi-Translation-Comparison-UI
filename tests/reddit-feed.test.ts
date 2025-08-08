import { describe, it, expect, vi, afterEach } from 'vitest'
import { GET } from '../app/api/reddit-feed/route'

const mockJson = {
  data: {
    children: [
      { data: { title: 'First', permalink: '/r/zen/1' } },
      { data: { title: 'Second', permalink: '/r/zen/2' } }
    ]
  }
}

describe('reddit feed API', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns simplified posts from reddit', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => mockJson
      })) as any
    )

    const res = await GET(new Request('http://localhost/api/reddit-feed'))
    const posts = await res.json()

    expect(fetch).toHaveBeenCalledWith('https://www.reddit.com/r/zen/top.json?limit=5')
    expect(posts).toEqual([
      { title: 'First', url: 'https://www.reddit.com/r/zen/1' },
      { title: 'Second', url: 'https://www.reddit.com/r/zen/2' }
    ])
  })

  it('handles fetch errors gracefully', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('network error')
      }) as any
    )

    const res = await GET(new Request('http://localhost/api/reddit-feed'))
    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body).toEqual({ error: 'Failed to fetch Reddit feed' })
  })
})
