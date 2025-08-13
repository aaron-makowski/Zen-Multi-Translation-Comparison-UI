import { prisma } from './db'
import { v4 as uuidv4 } from 'uuid'

/**
 * Ingests a simple text-based PDF where each line represents a verse.
 * Verses are stored for the provided book identifier.
 */
export async function ingestPdf(bookId: string, pdfData: Uint8Array) {
  const text = new TextDecoder().decode(pdfData)
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)

  // Ensure book exists
  await prisma.book.create({
    data: {
      id: bookId,
      title: 'Uploaded Book',
      description: 'Imported from PDF'
    }
  })

  for (let i = 0; i < lines.length; i++) {
    await prisma.verse.create({
      data: {
        id: uuidv4(),
        number: i + 1,
        bookId
      }
    })
  }
}
