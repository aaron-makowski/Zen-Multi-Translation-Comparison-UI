import { describe, it, expect } from 'vitest'
import { POST } from '../app/api/share/route'

const baseUrl = 'https://example.com'

function createRequest(body: Record<string, unknown>) {
  return new Request(`${baseUrl}/api/share`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  })
}

describe('POST /api/share', () => {
  it('returns a share URL for valid input', async () => {
    const req = createRequest({
      bookId: 'john',
      verseId: '3-16',
      highlight: 'For God so loved the world'
    })

    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.url).toBe(
      `${baseUrl}/books/john/verses/3-16?highlight=${encodeURIComponent(
        'For God so loved the world'
      )}`
    )
  })

  it('returns 400 when required fields are missing', async () => {
    const req = createRequest({ bookId: 'john' })
    const res = await POST(req)
    const data = await res.json()

    expect(res.status).toBe(400)
    expect(data.error).toBe('Missing fields')
  })
})
