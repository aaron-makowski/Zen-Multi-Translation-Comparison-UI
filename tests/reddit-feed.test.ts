import { describe, it, expect, vi } from 'vitest'
import { GET } from '../app/api/reddit-feed/route'

const mockResponse = {
  data: {
    children: [
      {
        data: { id: '1', title: 'Post', url: 'https://example.com' }
      }
    ]
  }
}

describe('reddit feed API', () => {
  it('returns parsed posts', async () => {
    const originalFetch = global.fetch
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(mockResponse) } as any)

    const res = await GET()
    const posts = await res.json()

    expect(posts).toEqual([
      { id: '1', title: 'Post', url: 'https://example.com' }
    ])

    global.fetch = originalFetch
  })

  it('handles invalid response structure', async () => {
    const originalFetch = global.fetch
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) } as any)

    const res = await GET()

    expect(res.status).toBe(502)
    const body = await res.json()
    expect(body.error).toBeDefined()

    global.fetch = originalFetch
  })

  it('handles fetch failure', async () => {
    const originalFetch = global.fetch
    global.fetch = vi.fn().mockRejectedValue(new Error('network error'))

    const res = await GET()

    expect(res.status).toBe(502)
    const body = await res.json()
    expect(body.error).toBe('Failed to reach Reddit')

    global.fetch = originalFetch
  })

  it('handles non-OK responses', async () => {
    const originalFetch = global.fetch
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500, json: () => Promise.resolve({}) } as any)

    const res = await GET()

    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toBe('Failed to fetch Reddit feed')

    global.fetch = originalFetch
  })
})
