import { PrismaClient } from "@prisma/client"
import { translations } from "../lib/translations"

const prisma = new PrismaClient()

async function main() {
  const books = Object.values(translations)

  for (const book of books) {
    const dbBook = await prisma.book.upsert({
      where: { id: book.id },
      update: {},
      create: {
        id: book.id,
        title: book.title,
        description: book.description,
        author: book.author || "",
        coverImage: book.coverImage || "",
      },
    })

    console.log(`Created book: ${dbBook.title}`)

    for (const verse of book.verses) {
      const verseId = `${book.id}-verse-${verse.id}`
      const dbVerse = await prisma.verse.upsert({
        where: { id: verseId },
        update: {},
        create: {
          id: verseId,
          number: verse.id,
          bookId: dbBook.id,
        },
      })

      console.log(`Created verse: ${dbVerse.number}`)

      for (const translator of book.translators) {
        const translationText =
          verse.lines
            .map((line) => line.translations[translator.id] || "")
            .join(" ")
            .trim() || "Translation not available."

        await prisma.translation.upsert({
          where: { id: `${verseId}-${translator.id}` },
          update: { text: translationText },
          create: {
            id: `${verseId}-${translator.id}`,
            text: translationText,
            translator: translator.id,
            verseId: dbVerse.id,
          },
        })

        console.log(`Created translation by: ${translator.id}`)
      }
    }
  }

  // Create a demo user
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      username: "demo",
      password: "$2a$10$GQH.xZm5DqJu8HgFtuhZEOsj7dQQgWlHhbwwZ1QzPJ8MzJyppyXOq", // hashed 'password123'
      isGuest: false,
    },
  })

  console.log(`Created demo user: ${demoUser.username}`)

  // Create a guest user
  const guestUser = await prisma.user.upsert({
    where: { email: "guest@example.com" },
    update: {},
    create: {
      email: "guest@example.com",
      username: "guest",
      password: "$2a$10$GQH.xZm5DqJu8HgFtuhZEOsj7dQQgWlHhbwwZ1QzPJ8MzJyppyXOq", // hashed 'password123'
      isGuest: true,
    },
  })

  console.log(`Created guest user: ${guestUser.username}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
