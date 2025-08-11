import { db } from "./db"
import { books, verses, translations as translationsTable } from "./schema"
import { translations as translationsData } from "./translations"
import { v4 as uuidv4 } from "uuid"

export async function seedDatabase() {
  console.log("Seeding database...")

  for (const [bookId, bookData] of Object.entries(translationsData)) {
    const existingBook = await db.query.books.findFirst({
      where: (b, { eq }) => eq(b.id, bookId),
    })

    if (existingBook) {
      continue
    }

    await db.transaction(async (tx) => {
      const [newBook] = await tx
        .insert(books)
        .values({
          id: bookId,
          title: bookData.title,
          description: bookData.description,
          author: bookData.author,
          coverImage: bookData.coverImage,
          updatedAt: new Date(),
        })
        .returning()

      for (const verse of bookData.verses) {
        const verseId = `${bookId}-verse-${verse.id}`
        const [newVerse] = await tx
          .insert(verses)
          .values({
            id: verseId,
            number: verse.id,
            bookId: newBook.id,
            updatedAt: new Date(),
          })
          .returning()

        const translationsToInsert = [] as {
          id: string
          text: string
          translator: string
          verseId: string
          updatedAt: Date
        }[]

        for (const translator of bookData.translators) {
          const text = verse.lines
            .map((line) => line.translations[translator.id])
            .filter(Boolean)
            .join(" ")
            .trim()
          if (!text) continue
          translationsToInsert.push({
            id: uuidv4(),
            text,
            translator: translator.name,
            verseId: newVerse.id,
            updatedAt: new Date(),
          })
        }

        if (translationsToInsert.length > 0) {
          await tx.insert(translationsTable).values(translationsToInsert)
        }
      }
    })

    console.log(`Seeded book: ${bookData.title}`)
  }

  console.log("Database seeded successfully!")
}
