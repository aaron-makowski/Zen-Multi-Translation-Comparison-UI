import fs from 'node:fs/promises'
import path from 'node:path'
import pdf from 'pdf-parse'
import { prisma } from '../lib/db'

// Parse a PDF and return verse text along with basic parsing stats
async function extractVerses(
  pdfPath: string,
): Promise<{
  verses: Record<number, string>
  stats: {
    skippedLines: number
    nonIncreasing: number
    duplicateVerses: number
    skippedVerseNumbers: number
  }
}> {
  const data = await pdf(await fs.readFile(pdfPath))
  const lines = data.text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  const verses: Record<number, string> = {}
  const stats = {
    skippedLines: 0,
    nonIncreasing: 0,
    duplicateVerses: 0,
    skippedVerseNumbers: 0,
  }
  let currentVerse: number | null = null
  let lastVerse: number | null = null

  lines.forEach((line, idx) => {
    const match = line.match(/^(\d+)\s+(.*)/)
    if (match) {
      const verseNum = parseInt(match[1], 10)
      if (lastVerse !== null) {
        if (verseNum <= lastVerse) {
          stats.nonIncreasing++
          console.warn(
            `Non-increasing or duplicate verse number ${verseNum} at line ${idx + 1} in ${pdfPath}`,
          )
        } else if (verseNum > lastVerse + 1) {
          stats.skippedVerseNumbers += verseNum - lastVerse - 1
          console.warn(
            `Skipped verse numbers between ${lastVerse + 1} and ${verseNum - 1} before line ${idx + 1} in ${pdfPath}`,
          )
        }
      }
      if (verses[verseNum] !== undefined) {
        stats.duplicateVerses++
        console.warn(`Duplicate verse number ${verseNum} at line ${idx + 1} in ${pdfPath}`)
      }
      currentVerse = verseNum
      verses[currentVerse] = match[2].trim()
      lastVerse = verseNum
    } else if (currentVerse !== null) {
      verses[currentVerse] += ' ' + line
    } else {
      stats.skippedLines++
      console.warn(
        `Skipping line not associated with any verse at line ${idx + 1} in ${pdfPath}: "${line}"`,
      )
    }
  })

  return { verses, stats }
}

async function processPdf(bookId: string, translatorId: string, pdfPath: string) {
  const { verses, stats } = await extractVerses(pdfPath)
  if (
    stats.skippedLines ||
    stats.nonIncreasing ||
    stats.duplicateVerses ||
    stats.skippedVerseNumbers
  ) {
    console.warn('Parsing stats for', pdfPath, stats)
  }
  for (const [numberStr, text] of Object.entries(verses)) {
    const number = Number(numberStr)
    const verseId = `${bookId}-verse-${number}`

    await prisma.$transaction(async (tx) => {
      const verse = await tx.verse.upsert({
        where: { id: verseId },
        update: {},
        create: {
          id: verseId,
          number,
          bookId,
        },
      })

      await tx.translation.upsert({
        where: { id: `${verseId}-${translatorId}` },
        update: { text },
        create: {
          id: `${verseId}-${translatorId}`,
          text,
          translator: translatorId,
          verseId: verse.id,
        },
      })
    })
  }
}

async function main() {
  const root = path.join(process.cwd(), 'public', 'pdfs')
  let bookDirs: string[] = []
  try {
    bookDirs = await fs.readdir(root)
  } catch (err) {
    console.error('No PDFs directory found:', root)
    return
  }

  for (const bookDirName of bookDirs) {
    const bookDir = path.join(root, bookDirName)
    const stat = await fs.stat(bookDir)
    if (!stat.isDirectory()) continue

    const files = await fs.readdir(bookDir)
    for (const file of files) {
      if (!file.endsWith('.pdf')) continue
      const translatorId = path.basename(file, '.pdf')
      const pdfPath = path.join(bookDir, file)
      console.log(`Processing ${pdfPath}`)
      await processPdf(bookDirName, translatorId, pdfPath)
    }
  }

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  prisma.$disconnect().finally(() => process.exit(1))
})

