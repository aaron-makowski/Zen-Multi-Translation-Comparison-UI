import { db } from "./db"
import { books, verses, translations } from "./schema"
import { translations as translationsData } from "./translations"
import { v4 as uuidv4 } from "uuid"
import { logger, logError } from "./logger"

export async function seedDatabase() {
  logger.info("Seeding database...")
  try {
    const xinxinmingData = translationsData.xinxinming

    // Check if book already exists
    const existingBook = await db.query.books.findFirst({
      where: (books, { eq }) => eq(books.title, xinxinmingData.title),
    })

    if (existingBook) {
      logger.info("Database already seeded.")
      return
    }

    // Using a transaction to ensure all or nothing is inserted
    await db.transaction(async (tx) => {
      const [newBook] = await tx
        .insert(books)
        .values({
          id: uuidv4(),
          title: xinxinmingData.title,
          description: xinxinmingData.description,
          author: "Jianzhi Sengcan",
          coverImage: "/xinxin-ming-cover.png",
          updatedAt: new Date(),
        })
        .returning()

      for (const verse of xinxinmingData.verses) {
        const [newVerse] = await tx
          .insert(verses)
          .values({
            id: uuidv4(),
            number: verse.number,
            bookId: newBook.id,
            updatedAt: new Date(),
          })
          .returning()

        const translationsToInsert = xinxinmingData.translators.map((translator) => ({
          id: uuidv4(),
          text: verse.translations[translator.name] || "Translation not available.",
          translator: translator.name,
          verseId: newVerse.id,
          updatedAt: new Date(),
        }))

        if (translationsToInsert.length > 0) {
          await tx.insert(translations).values(translationsToInsert)
        }
      }
    })

    logger.info("Database seeded successfully!")
  } catch (error) {
    logError(error, "Error seeding database")
    throw error
  }
}
