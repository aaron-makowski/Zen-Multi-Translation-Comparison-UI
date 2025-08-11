import { PrismaClient } from "@prisma/client"
import { translations as translationsData } from "../lib/translations"

const prisma = new PrismaClient()

async function main() {
  for (const [bookId, book] of Object.entries(translationsData)) {
    const createdBook = await prisma.book.upsert({
      where: { id: bookId },
      update: {},
      create: {
        id: bookId,
        title: book.title,
        description: book.description,
        author: book.author,
        coverImage: book.coverImage,
      },
    })

    console.log(`Created book: ${createdBook.title}`)

    for (const verse of book.verses) {
      const verseId = `${bookId}-verse-${verse.id}`
      const createdVerse = await prisma.verse.upsert({
        where: { id: verseId },
        update: {},
        create: {
          id: verseId,
          number: verse.id,
          bookId: createdBook.id,
        },
      })

      console.log(`Created verse: ${createdVerse.number}`)

      for (const translator of book.translators) {
        const text = verse.lines
          .map((line) => line.translations[translator.id])
          .filter(Boolean)
          .join(" ")
          .trim()
        if (!text) continue
        await prisma.translation.upsert({
          where: { id: `${verseId}-${translator.id}` },
          update: { text },
          create: {
            id: `${verseId}-${translator.id}`,
            text,
            translator: translator.name,
            verseId: createdVerse.id,
          },
        })
        console.log(`Created translation by: ${translator.name}`)
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
