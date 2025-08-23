import { describe, expect, it, vi, afterEach } from 'vitest'
import { GET } from '../app/api/reddit-feed/route'

const sample = {
  data: {
    children: [
      { data: { id: '1', title: 'Post', url: 'https://example.com' } }
    ]
  }
}

describe('reddit feed API', () => {
  afterEach(() => vi.restoreAllMocks())

  it('returns posts from reddit', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(sample)
    } as any)

    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual([
      { id: '1', title: 'Post', url: 'https://example.com' }
    ])
  })

  it('uses the public subreddit feed', async () => {
    const mock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(sample)
    } as any)

    await GET()
    expect(mock).toHaveBeenCalledWith('https://www.reddit.com/r/zen.json')
  })

  it('handles fetch failures', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('nope'))

    const res = await GET()
    expect(res.status).toBe(502)
    const body = await res.json()
    expect(body.error).toBe('Failed to reach Reddit')
  })
})
