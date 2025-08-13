import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
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
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns parsed posts', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    } as any)

    const res = await GET()
    const posts = await res.json()

    expect(posts).toEqual([
      { id: '1', title: 'Post', url: 'https://example.com' }
    ])
  })

  it('requests the Reddit JSON feed', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      } as any)

    await GET()
    expect(fetchMock).toHaveBeenCalledWith('https://www.reddit.com/r/zen.json')
  })

  it('returns empty array when no posts', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          data: { children: [] }
        })
    } as any)

    const res = await GET()
    const posts = await res.json()

    expect(posts).toEqual([])
  })

  it('handles invalid response structure', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({})
    } as any)

    const res = await GET()

    expect(res.status).toBe(502)
    const body = await res.json()
    expect(body.error).toBeDefined()
  })

  it('handles fetch failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network error'))

    const res = await GET()

    expect(res.status).toBe(502)
    const body = await res.json()
    expect(body.error).toBe('Failed to reach Reddit')
  })

  it('handles non-OK responses', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({})
    } as any)

    const res = await GET()

    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toBe('Failed to fetch Reddit feed')
  })

  it('propagates upstream status codes', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 502,
      json: () => Promise.resolve({})
    } as any)

    const res = await GET()

    expect(res.status).toBe(502)
    const body = await res.json()
    expect(body.error).toBe('Failed to fetch Reddit feed')
  })

  it('handles posts missing required fields', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          data: {
            children: [
              { data: { id: '1', title: 'Missing URL' } }
            ]
          }
        })
    } as any)

    const res = await GET()

    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body.error).toBe('Failed to parse Reddit posts')
  })

  it('handles invalid JSON', async () => {
    const originalFetch = global.fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => {
        throw new Error('bad json')
      }
    } as any)

    const res = await GET()

    expect(res.status).toBe(502)
    const body = await res.json()
    expect(body.error).toBe('Invalid JSON from Reddit')

    global.fetch = originalFetch
  })
})
