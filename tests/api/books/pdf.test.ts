import { describe, it, expect } from 'vitest'
import { GET as getPdf } from '../../../app/api/books/[bookId]/pdf/route'
import { promises as fs } from 'fs'
import path from 'path'

const pdfPath = path.join(process.cwd(), 'public/xinxinming.pdf')

describe('GET /api/books/[bookId]/pdf', () => {
  it('streams the PDF when available', async () => {
    await fs.writeFile(pdfPath, 'dummy pdf')
    const res = await getPdf(new Request('http://localhost'), { params: { bookId: 'xinxinming' } })
    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('application/pdf')
    const buf = await res.arrayBuffer()
    expect(buf.byteLength).toBeGreaterThan(0)
    await fs.unlink(pdfPath)
  })

  it('returns 404 when PDF is missing', async () => {
    const res = await getPdf(new Request('http://localhost'), { params: { bookId: 'xinxinming' } })
    expect(res.status).toBe(404)
    const json = await res.json()
    expect(json).toEqual({ error: 'PDF not found' })
  })
})
