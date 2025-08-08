import { PrismaClient } from "@prisma/client"
import { translations } from "../lib/translations"

const prisma = new PrismaClient()

async function main() {
  for (const bookData of Object.values(translations)) {
    const book = await prisma.book.upsert({
      where: { id: bookData.id },
      update: {},
      create: {
        id: bookData.id,
        title: bookData.title,
        description: bookData.description,
        author: bookData.author,
        coverImage: bookData.coverImage,
      },
    })

    console.log(`Created book: ${book.title}`)

    for (const verse of bookData.verses) {
      const verseRecord = await prisma.verse.upsert({
        where: { id: `${bookData.id}-verse-${verse.id}` },
        update: { number: verse.id },
        create: {
          id: `${bookData.id}-verse-${verse.id}`,
          number: verse.id,
          bookId: book.id,
        },
      })

      console.log(`Created verse: ${verseRecord.number}`)

      for (const translator of bookData.translators) {
        const translationText = verse.lines
          .map((line) => line.translations[translator.id] || "")
          .join("\n")

        await prisma.translation.upsert({
          where: {
            id: `${bookData.id}-verse-${verse.id}-${translator.id}`,
          },
          update: {
            text: translationText,
          },
          create: {
            id: `${bookData.id}-verse-${verse.id}-${translator.id}`,
            text: translationText,
            translator: translator.name,
            verseId: verseRecord.id,
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
