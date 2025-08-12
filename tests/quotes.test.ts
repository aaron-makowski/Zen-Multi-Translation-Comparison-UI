import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '../app/api/quotes/route'
import { promises as fs } from 'fs'

const localFallback = { text: 'Be present. The rest will follow.' }
const finalFallback = { text: 'Be present.', author: 'Unknown' }

describe('GET /api/quotes', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns reddit quote when fetch succeeds', async () => {
    const redditQuote = { text: 'Reddit quote', author: 'redditUser' }
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: async () => ({ data: { children: [{ data: { title: redditQuote.text, author: redditQuote.author } }] } })
    } as any)

    const res = await GET()
    const json = await res.json()
    expect(json).toEqual(redditQuote)
  })

  it('falls back to static quote when reddit fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network'))
    const staticQuote = { text: 'Static quote', author: 'File' }
    vi.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify([staticQuote]))

    const res = await GET()
    const json = await res.json()
    expect(json).toEqual(staticQuote)
  })

  it('returns local fallback when both sources fail', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network'))
    vi.spyOn(fs, 'readFile').mockRejectedValue(new Error('fs'))

    const res = await GET()
    const json = await res.json()
    expect(json).toEqual(localFallback)
  })

  it('returns default quote when quotes.json is empty', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network'))
    vi.spyOn(fs, 'readFile').mockResolvedValue('[]')

    const res = await GET()
    const json = await res.json()
    expect(json).toEqual(finalFallback)
  })

  it('uses static fallback when reddit response is malformed', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: async () => ({ data: { children: null } })
    } as any)
    const staticQuote = { text: 'Static quote', author: 'File' }
    vi.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify([staticQuote]))

    const res = await GET()
    const json = await res.json()
    expect(json).toEqual(staticQuote)
  })

  it('returns object with text and author fields', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: async () => ({ data: { children: [{ data: { title: 'A', author: 'B' } }] } })
    } as any)

    const res = await GET()
    const json = await res.json()
    expect(json).toHaveProperty('text')
    expect(json).toHaveProperty('author')
  })
})
