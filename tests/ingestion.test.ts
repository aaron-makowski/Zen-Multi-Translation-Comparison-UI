import { describe, it, expect, vi } from 'vitest'

vi.mock('../lib/db', () => ({
  prisma: {
    book: { create: vi.fn().mockResolvedValue(null) },
    verse: { create: vi.fn().mockResolvedValue(null) }
  }
}))

import { ingestPdf } from '../lib/ingestion'
import { prisma } from '../lib/db'

describe('PDF ingestion', () => {
  it('stores verses for each line in the PDF', async () => {
    const pdfText = 'First line\nSecond line'
    const buffer = new TextEncoder().encode(pdfText)

    await ingestPdf('b1', buffer)

    expect(prisma.book.create).toHaveBeenCalledOnce()
    expect(prisma.verse.create).toHaveBeenCalledTimes(2)
    expect((prisma.verse.create as any).mock.calls[0][0].data).toMatchObject({
      number: 1,
      bookId: 'b1'
    })
  })
})
