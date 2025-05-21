import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { WordComparisonTable } from "@/components/books/word-comparison-table"

export default async function WordComparisonPage({ params }: { params: { bookId: string; verseId: string } }) {
  const user = await getCurrentUser()

  const verse = await prisma.verse.findUnique({
    where: { id: params.verseId },
    include: {
      chapter: {
        include: {
          book: true,
        },
      },
      lines: {
        orderBy: { lineNumber: "asc" },
        include: {
          translations: {
            include: {
              translation: true,
            },
          },
        },
      },
    },
  })

  if (!verse) {
    notFound()
  }

  // Get all translations for this book
  const bookTranslations = await prisma.translation.findMany({
    where: { bookId: params.bookId },
    orderBy: { title: "asc" },
  })

  // Process the verse lines and translations for word-by-word comparison
  const processedLines = verse.lines.map((line) => {
    // Split the original text into words
    const originalWords = line.originalText.split(/\s+/).filter(Boolean)

    // Get translations for this line
    const translationsByTranslator = line.translations.reduce(
      (acc, curr) => {
        acc[curr.translation.id] = {
          id: curr.translation.id,
          translator: curr.translation.translator,
          year: curr.translation.year,
          text: curr.text,
          words: curr.text.split(/\s+/).filter(Boolean),
        }
        return acc
      },
      {} as Record<string, { id: string; translator: string; year: string | null; text: string; words: string[] }>,
    )

    return {
      lineId: line.id,
      lineNumber: line.lineNumber,
      originalText: line.originalText,
      originalWords,
      translations: Object.values(translationsByTranslator),
    }
  })

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Link
          href={`/books/${params.bookId}/verses/${params.verseId}`}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Verse
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Word-by-Word Comparison</h1>
            <p className="text-muted-foreground">
              {verse.chapter.book.title} - Chapter {verse.chapter.number}, Verse {verse.number}
            </p>
          </div>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Original Text</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {verse.lines.map((line) => (
              <div key={line.id} className="flex flex-col">
                <div className="text-lg font-medium">{line.originalText}</div>
                {line.romanization && <div className="text-sm text-muted-foreground">{line.romanization}</div>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {processedLines.map((line) => (
          <Card key={line.lineId}>
            <CardHeader>
              <CardTitle className="text-base">Line {line.lineNumber}</CardTitle>
            </CardHeader>
            <CardContent>
              <WordComparisonTable line={line} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
