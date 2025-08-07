import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { verses } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { CommentSection } from "@/components/comment-section"
import { VerseViewTracker } from "@/components/verse-view-tracker"
import { TranslationView } from "@/components/translation-view"

export default async function VersePage({
  params,
}: {
  params: { bookId: string; verseId: string }
}) {
  const verse = await db.query.verses.findFirst({
    where: eq(verses.id, params.verseId),
    with: {
      book: true,
      translations: {
        orderBy: (translations, { asc }) => [asc(translations.translator)],
      },
    },
  })

  if (!verse) {
    notFound()
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <VerseViewTracker verseId={params.verseId} />
      <div className="max-w-4xl w-full">
        <div className="mb-6">
          <Link href={`/books/${params.bookId}`} className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to {verse.book.title}
          </Link>
          <h1 className="text-3xl font-bold">Verse {verse.number}</h1>
          <p className="text-gray-600">{verse.book.title}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Translations</h2>

          <div className="space-y-6">
            {verse.translations.map((translation) => (
              <TranslationView
                key={translation.id}
                translation={translation}
                verseId={params.verseId}
              />
            ))}
          </div>
        </div>

        <CommentSection verseId={params.verseId} />

        <div className="flex justify-between">
          <Link
            href={`/books/${params.bookId}/verses/${params.verseId}/word-comparison`}
            className="text-blue-600 hover:underline"
          >
            Compare translations word-by-word →
          </Link>
        </div>
      </div>
    </main>
  )
}
