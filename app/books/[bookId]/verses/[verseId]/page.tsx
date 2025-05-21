import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ArrowRight, BookOpen, PenSquare, SplitSquareVertical } from "lucide-react"
import { CommentSection } from "@/components/books/comment-section"
import { NoteSection } from "@/components/books/note-section"
import { TranslationCompare } from "@/components/books/translation-compare"

export default async function VersePage({ params }: { params: { bookId: string; verseId: string } }) {
  const user = await getCurrentUser()

  const verse = await prisma.verse.findUnique({
    where: { id: params.verseId },
    include: {
      chapter: {
        include: {
          book: true,
          verses: {
            select: { id: true, number: true },
            orderBy: { number: "asc" },
          },
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
      comments: {
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
      notes: user
        ? {
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
          }
        : undefined,
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

  // Find previous and next verses
  const currentIndex = verse.chapter.verses.findIndex((v) => v.id === verse.id)
  const prevVerse = currentIndex > 0 ? verse.chapter.verses[currentIndex - 1] : null
  const nextVerse = currentIndex < verse.chapter.verses.length - 1 ? verse.chapter.verses[currentIndex + 1] : null

  // Group translations by translator
  const translationsByTranslator = verse.lines
    .flatMap((line) =>
      line.translations.map((translation) => ({
        translationId: translation.translation.id,
        translator: translation.translation.translator,
        title: translation.translation.title,
        year: translation.translation.year,
        text: translation.text,
        lineNumber: line.lineNumber,
      })),
    )
    .reduce(
      (acc, curr) => {
        if (!acc[curr.translationId]) {
          acc[curr.translationId] = {
            id: curr.translationId,
            translator: curr.translator,
            title: curr.title,
            year: curr.year,
            lines: {},
          }
        }
        acc[curr.translationId].lines[curr.lineNumber] = curr.text
        return acc
      },
      {} as Record<
        string,
        { id: string; translator: string; title: string; year: string | null; lines: Record<number, string> }
      >,
    )

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Link
          href={`/books/${params.bookId}/chapters/${verse.chapter.id}`}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Chapter {verse.chapter.number}
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Verse {verse.number}</h1>
            <p className="text-muted-foreground">
              {verse.chapter.book.title} - Chapter {verse.chapter.number}
              {verse.chapter.title && `: ${verse.chapter.title}`}
            </p>
          </div>

          <div className="flex gap-2">
            {prevVerse && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/books/${params.bookId}/verses/${prevVerse.id}`}>
                  <ArrowLeft className="mr-1 h-4 w-4" /> Verse {prevVerse.number}
                </Link>
              </Button>
            )}

            {nextVerse && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/books/${params.bookId}/verses/${nextVerse.id}`}>
                  Verse {nextVerse.number} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            )}
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

      <Tabs defaultValue="compare" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="compare">Compare Translations</TabsTrigger>
          <TabsTrigger value="word-by-word" className="flex items-center gap-1">
            <SplitSquareVertical className="h-4 w-4" /> Word-by-Word
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-1">
            <PenSquare className="h-4 w-4" /> Notes
          </TabsTrigger>
          <TabsTrigger value="discussion" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" /> Discussion
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compare" className="mt-6">
          <TranslationCompare
            verse={verse}
            translations={Object.values(translationsByTranslator)}
            allTranslations={bookTranslations}
          />
        </TabsContent>

        <TabsContent value="word-by-word" className="mt-6">
          <div className="text-center py-6">
            <h3 className="text-lg font-medium mb-2">Word-by-Word Comparison</h3>
            <p className="text-muted-foreground mb-4">
              Compare translations word by word to see how different translators interpreted each term.
            </p>
            <Button asChild>
              <Link href={`/books/${params.bookId}/verses/${params.verseId}/word-comparison`}>
                <SplitSquareVertical className="mr-2 h-4 w-4" /> View Word-by-Word Comparison
              </Link>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <NoteSection verseId={verse.id} notes={verse.notes || []} currentUser={user} />
        </TabsContent>

        <TabsContent value="discussion" className="mt-6">
          <CommentSection bookId={params.bookId} verseId={verse.id} comments={verse.comments} currentUser={user} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
