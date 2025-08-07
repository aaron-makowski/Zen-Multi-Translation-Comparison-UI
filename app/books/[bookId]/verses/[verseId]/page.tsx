import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { CommentSection } from "@/components/comment-section"
import { Button } from "@/components/ui/button"
import { SwipeNavigator } from "@/components/swipe-navigator"

export default async function VersePage({
  params,
}: {
  params: { bookId: string; verseId: string }
}) {
  const verse = await prisma.verse.findUnique({
    where: {
      id: params.verseId,
    },
    include: {
      book: true,
      translations: {
        orderBy: {
          translator: "asc",
        },
      },
    },
  })

  const [prevVerse, nextVerse] = await Promise.all([
    prisma.verse.findFirst({
      where: {
        bookId: params.bookId,
        number: { lt: verse?.number || 0 },
      },
      orderBy: { number: "desc" },
    }),
    prisma.verse.findFirst({
      where: {
        bookId: params.bookId,
        number: { gt: verse?.number || 0 },
      },
      orderBy: { number: "asc" },
    }),
  ])

  if (!verse) {
    notFound()
  }

  return (
    <SwipeNavigator
      prevUrl={prevVerse ? `/books/${params.bookId}/verses/${prevVerse.id}` : undefined}
      nextUrl={nextVerse ? `/books/${params.bookId}/verses/${nextVerse.id}` : undefined}
    >
      <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 md:p-24">
        <div className="max-w-4xl w-full">
          <div className="mb-6">
            <Button asChild variant="outline" size="sm" className="mb-4">
              <Link href={`/books/${params.bookId}`}>← Back to {verse.book.title}</Link>
            </Button>
            <h1 className="text-3xl font-bold">Verse {verse.number}</h1>
            <p className="text-gray-600">{verse.book.title}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Translations</h2>

            <div className="space-y-6">
              {verse.translations.map((translation) => (
                <div key={translation.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <h3 className="font-medium text-lg mb-2">Translation by {translation.translator}</h3>
                  <p className="text-gray-800 whitespace-pre-line leading-relaxed">{translation.text}</p>
                  <p className="text-sm text-gray-500 mt-2">Language: {translation.language}</p>
                </div>
              ))}
            </div>
          </div>

          <CommentSection verseId={params.verseId} />

          <div className="flex justify-between items-center mt-8 gap-2">
            {prevVerse && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/books/${params.bookId}/verses/${prevVerse.id}`}>← Previous</Link>
              </Button>
            )}
            {nextVerse && (
              <Button asChild variant="outline" size="sm" className="ml-auto">
                <Link href={`/books/${params.bookId}/verses/${nextVerse.id}`}>Next →</Link>
              </Button>
            )}
          </div>

          <div className="flex justify-end mt-4">
            <Button asChild variant="link" className="p-0 text-blue-600">
              <Link href={`/books/${params.bookId}/verses/${params.verseId}/word-comparison`}>
                Compare translations word-by-word →
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </SwipeNavigator>
  )
}
