import { db } from "./db"
import { books, verses, translations as translationsTable } from "./schema"
import { translations } from "./translations"
import { v4 as uuidv4 } from "uuid"

export async function seedDatabase() {
  console.log("Seeding database...")

  // Iterate through every book defined in lib/translations.ts
  const booksToSeed = Object.values(translations)

  for (const book of booksToSeed) {
    const existingBook = await db.query.books.findFirst({
      where: (b, { eq }) => eq(b.id, book.id),
    })

    if (existingBook) {
      console.log(`${book.title} already seeded.`)
      continue
    }

    await db.transaction(async (tx) => {
      const [newBook] = await tx
        .insert(books)
        .values({
          id: book.id,
          title: book.title,
          description: book.description,
          author: book.author || null,
          coverImage: book.coverImage || null,
          updatedAt: new Date(),
        })
        .returning()

      for (const verse of book.verses) {
        const [newVerse] = await tx
          .insert(verses)
          .values({
            id: uuidv4(),
            number: verse.id,
            bookId: newBook.id,
            updatedAt: new Date(),
          })
          .returning()

        const translationsToInsert = book.translators.map((translator) => ({
          id: uuidv4(),
          text:
            verse.lines
              .map((line) => line.translations[translator.id] || "")
              .join(" ")
              .trim() || "Translation not available.",
          translator: translator.id,
          verseId: newVerse.id,
          updatedAt: new Date(),
        }))

        if (translationsToInsert.length > 0) {
          await tx.insert(translationsTable).values(translationsToInsert)
        }
      }
    })

    console.log(`Seeded ${book.title}`)
  }

  console.log("Database seeding complete!")
}
