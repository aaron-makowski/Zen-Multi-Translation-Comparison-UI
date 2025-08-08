import { db } from "./db"
import { books, verses, translations } from "./schema"
import { translations as translationsData } from "./translations"
import { v4 as uuidv4 } from "uuid"

export async function seedDatabase() {
  console.log("Seeding database...")

  for (const bookData of Object.values(translationsData)) {
    const existingBook = await db.query.books.findFirst({
      where: (books, { eq }) => eq(books.id, bookData.id),
    })

    if (existingBook) {
      console.log(`Book ${bookData.title} already exists, skipping.`)
      continue
    }

    await db.transaction(async (tx) => {
      const [newBook] = await tx
        .insert(books)
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
        const [newVerse] = await tx
          .insert(verses)
          .values({
            id: uuidv4(),
            number: verse.id,
            bookId: newBook.id,
            updatedAt: new Date(),
          })
          .returning()

        const translationsToInsert = bookData.translators
          .map((translator) => ({
            id: uuidv4(),
            text: verse.lines
              .map((line) => line.translations[translator.id] || "")
              .join("\n"),
            translator: translator.name,
            verseId: newVerse.id,
            updatedAt: new Date(),
          }))
          .filter((t) => t.text.trim().length > 0)

        if (translationsToInsert.length > 0) {
          await tx.insert(translations).values(translationsToInsert)
        }
      }
    })
  }

  console.log("Database seeded successfully!")
}
