import { describe, it, expect, afterEach } from 'vitest'
import { GET } from '../app/api/share/route'

describe('/api/share', () => {
  const ORIGINAL_BASE = process.env.NEXT_PUBLIC_APP_URL

  afterEach(() => {
    if (ORIGINAL_BASE === undefined) {
      delete process.env.NEXT_PUBLIC_APP_URL
    } else {
      process.env.NEXT_PUBLIC_APP_URL = ORIGINAL_BASE
    }
  })

  it('generates encoded share links for all platforms', async () => {
    const cases = [
      {
        text: 'Hello World!',
        url: 'https://example.com/a?b=1&c=two'
      },
      {
        text: 'Symbols & spaces',
        url: 'https://foo.bar/baz qux?q=one&z=2'
      }
    ]

    for (const { text, url } of cases) {
      const res = await GET(
        new Request(`http://test/api/share?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
      )
      const data = await res.json()
      const encodedText = encodeURIComponent(text)
      const encodedUrl = encodeURIComponent(url)

      expect(data).toEqual({
        twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedText}`
      })
    }
  })

  it('returns 400 when text is missing', async () => {
    const res = await GET(new Request('http://test/api/share?url=https://example.com'))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'Missing text' })
  })

  it('falls back to default base URL when url is missing', async () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://base.example'
    const res = await GET(new Request('http://test/api/share?text=hi'))
    const data = await res.json()
    const encodedText = encodeURIComponent('hi')
    const encodedUrl = encodeURIComponent('https://base.example')

    expect(data.twitter).toBe(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`)
    expect(data.facebook).toBe(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`)
    expect(data.reddit).toBe(`https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedText}`)
  })
})
