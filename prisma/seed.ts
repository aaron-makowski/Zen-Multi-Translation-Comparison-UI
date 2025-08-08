import { PrismaClient } from "@prisma/client"
import { translations } from "../lib/translations"

const prisma = new PrismaClient()

async function main() {
  // Create a book for Xinxin Ming
  const xinxinMing = await prisma.book.upsert({
    where: { id: "xinxin-ming" },
    update: {},
    create: {
      id: "xinxin-ming",
      title: "Xinxin Ming",
      description: "Faith in Mind - A classic Zen poem attributed to the Third Patriarch of Zen, Jianzhi Sengcan",
      author: "Jianzhi Sengcan",
      coverImage: "/xinxin-ming-cover.png",
      pdfPath: null,
    },
  })

  console.log(`Created book: ${xinxinMing.title}`)

  // Create verses and translations
  for (const [index, translation] of translations.entries()) {
    const verseNumber = index + 1

    // Create verse
    const verse = await prisma.verse.upsert({
      where: {
        id: `xinxin-ming-verse-${verseNumber}`,
      },
      update: {},
      create: {
        id: `xinxin-ming-verse-${verseNumber}`,
        number: verseNumber,
        bookId: xinxinMing.id,
      },
    })

    console.log(`Created verse: ${verse.number}`)

    // Create translations for each translator
    for (const translator of Object.keys(translation)) {
      const translationText = translation[translator]

      await prisma.translation.upsert({
        where: {
          id: `xinxin-ming-verse-${verseNumber}-${translator}`,
        },
        update: {
          text: translationText,
        },
        create: {
          id: `xinxin-ming-verse-${verseNumber}-${translator}`,
          text: translationText,
          translator: translator,
          verseId: verse.id,
        },
      })

      console.log(`Created translation by: ${translator}`)
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
