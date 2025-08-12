import Link from "next-intl/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { CommentSection } from "@/components/comment-section"

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

  if (!verse) {
    notFound()
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
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
              <div key={translation.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                <h3 className="font-medium text-lg mb-2">Translation by {translation.translator}</h3>
                <p className="text-gray-800 whitespace-pre-line">{translation.text}</p>
                <p className="text-sm text-gray-500 mt-2">Language: {translation.language}</p>
              </div>
            ))}
          </div>
        </div>

        <CommentSection verseId={params.verseId} userId="demo-user" />

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
