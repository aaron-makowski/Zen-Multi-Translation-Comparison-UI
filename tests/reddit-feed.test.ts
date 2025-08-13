import { describe, it, expect, vi, afterEach } from 'vitest'
import { GET } from '../app/api/reddit-feed/route'

describe('reddit feed API', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns posts from reddit', async () => {
    const mockResponse = {
      data: {
        children: [
          { data: { id: '1', title: 'Post', url: 'https://example.com' } }
        ]
      }
    }
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      }) as any
    )

    const res = await GET()
    const posts = await res.json()
    expect(posts).toEqual([
      { id: '1', title: 'Post', url: 'https://example.com' }
    ])
  })

  it('handles network errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('fail')))

    const res = await GET()
    expect(res.status).toBe(502)
    expect(await res.json()).toEqual({ error: 'Failed to reach Reddit' })
  })
})
