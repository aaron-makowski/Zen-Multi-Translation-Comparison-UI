import { prisma } from "./db"
import { translations } from "./translations"
import bcrypt from "bcryptjs"
import { logger, logError } from "./logger"

export async function seedDatabase() {
  try {
    // Check if database is already seeded
    const existingBooks = await prisma.book.findMany()
    if (existingBooks.length > 0) {
      logger.info("Database already seeded")
      return
    }

    // Create a book for Xinxin Ming
    const xinxinMing = await prisma.book.create({
      data: {
        id: "xinxin-ming",
        title: "Xinxin Ming",
        description: "Faith in Mind - A classic Zen poem attributed to the Third Patriarch of Zen, Jianzhi Sengcan",
        author: "Jianzhi Sengcan",
        coverImage: "/xinxin-ming-cover.png",
        pdfPath: null,
      },
    })

    logger.info(`Created book: ${xinxinMing.title}`)

    // Create verses and translations
    for (const [index, translation] of translations.entries()) {
      const verseNumber = index + 1

      // Create verse
      const verse = await prisma.verse.create({
        data: {
          id: `xinxin-ming-verse-${verseNumber}`,
          number: verseNumber,
          bookId: xinxinMing.id,
        },
      })

      logger.info(`Created verse: ${verse.number}`)

      // Create translations for each translator
      for (const translator of Object.keys(translation)) {
        const translationText = translation[translator]

        await prisma.translation.create({
          data: {
            id: `xinxin-ming-verse-${verseNumber}-${translator}`,
            text: translationText,
            translator: translator,
            verseId: verse.id,
          },
        })

        logger.info(`Created translation by: ${translator}`)
      }
    }

    // Create a demo user
    const hashedPassword = await bcrypt.hash("password123", 10)

    const demoUser = await prisma.user.create({
      data: {
        email: "demo@example.com",
        username: "demo",
        password: hashedPassword,
        isGuest: false,
      },
    })

    logger.info(`Created demo user: ${demoUser.username}`)

    // Create a guest user
    const guestUser = await prisma.user.create({
      data: {
        email: "guest@example.com",
        username: "guest",
        password: hashedPassword,
        isGuest: true,
      },
    })

    logger.info(`Created guest user: ${guestUser.username}`)

    return { success: true }
  } catch (error) {
    logError(error, "Error seeding database")
    return { success: false, error }
  }
}
