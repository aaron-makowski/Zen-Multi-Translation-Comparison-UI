import { db } from "./db"
import {
  books as booksTable,
  verses as versesTable,
  translations as translationsTable,
} from "./schema"
import { translations as translationsData } from "./translations"
import { v4 as uuidv4 } from "uuid"

export async function seedDatabase() {
  console.log("Seeding database...")

  for (const bookData of Object.values(translationsData)) {
    const existingBook = await db.query.books.findFirst({
      where: (booksTbl, { eq }) => eq(booksTbl.id, bookData.id),
    })

    if (existingBook) {
      console.log(`Book "${bookData.title}" already exists.`)
      continue
    }

    await db.transaction(async (tx) => {
      const [newBook] = await tx
        .insert(booksTable)
        .values({
          id: bookData.id,
          title: bookData.title,
          description: bookData.description,
          author: bookData.author,
          coverImage: bookData.coverImage,
          updatedAt: new Date(),
        })
        .returning()

      for (const verse of bookData.verses) {
        const verseId = `${bookData.id}-verse-${verse.id}`
        const [newVerse] = await tx
          .insert(versesTable)
          .values({
            id: verseId,
            number: verse.id,
            bookId: newBook.id,
            updatedAt: new Date(),
          })
          .returning()

        for (const translator of bookData.translators) {
          const translationText = verse.lines
            .map((line) => line.translations[translator.id])
            .filter(Boolean)
            .join("\n")

          if (translationText) {
            await tx.insert(translationsTable).values({
              id: uuidv4(),
              text: translationText,
              translator: translator.name,
              verseId: newVerse.id,
              updatedAt: new Date(),
            })
          }
        }
      }
    })

    console.log(`Seeded book: ${bookData.title}`)
  }

  console.log("Database seeded successfully!")
}
