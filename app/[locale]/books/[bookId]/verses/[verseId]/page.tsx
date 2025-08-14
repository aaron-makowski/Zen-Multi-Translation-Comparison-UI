import Link from "next-intl/link"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { CommentSection } from "@/components/comment-section"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default async function VersePage({
  params,
}: {
  params: { bookId: string; verseId: string }
}) {
  const verse = await db.query.verses.findFirst({
    where: eq(verses.id, params.verseId),
    with: {
      book: true,
    },
  })

  if (!verse) {
    notFound()
  }

  const initialTranslations = await db.query.translations.findMany({
    where: eq(translations.verseId, params.verseId),
    orderBy: (translations, { asc }) => [asc(translations.translator)],
    limit: PAGE_SIZE,
  })

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24 touch-pan-y">
      <div className="max-w-4xl w-full">
        <div className="flex items-center gap-2 mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href={`/books/${params.bookId}`}>← Back to {verse.book.title}</Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-1">Verse {verse.number}</h1>
        <p className="text-gray-600 mb-6">{verse.book.title}</p>

        <h2 className="text-xl font-semibold mb-4">Translations</h2>
        <div className="space-y-4 sm:space-y-6 mb-8">
          {verse.translations.map((translation) => (
            <Card key={translation.id} className="p-4 sm:p-6">
              <h3 className="font-medium text-lg mb-2">Translation by {translation.translator}</h3>
              <p className="text-gray-800 whitespace-pre-line text-sm sm:text-base">{translation.text}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Language: {translation.language}
              </p>
            </Card>
          ))}
        </div>

        <CommentSection verseId={params.verseId} userId="demo-user" />

        <div className="flex justify-between mt-8">
          <Button
            asChild
            variant="link"
            className="h-auto p-0 text-blue-600"
          >
            <Link href={`/books/${params.bookId}/verses/${params.verseId}/word-comparison`}>
              Compare translations word-by-word →
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
