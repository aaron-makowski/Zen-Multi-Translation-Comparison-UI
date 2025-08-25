import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { GET } from './route'
import quotes from '../../../data/quotes.json'

describe('GET /api/quotes', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01'))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('returns quote from Reddit when fetch succeeds', async () => {
    vi.stubGlobal('fetch', () =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            data: { children: [{ data: { title: 'Reddit quote', author: 'user1' } }] }
          }),
          { status: 200 }
        )
      )
    )

    const res = await GET()
    const data = await res.json()
    expect(data).toEqual({ text: 'Reddit quote', author: 'user1' })
  })

  it('falls back to static quotes when Reddit fetch fails', async () => {
    vi.stubGlobal('fetch', () => Promise.resolve(new Response('', { status: 500 })))

    const res = await GET()
    const data = await res.json()
    const expected = (quotes as { text: string; author: string }[])[1]
    expect(data).toEqual(expected)
  })
})
