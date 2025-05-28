import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"

export default async function BookPage({ params }: { params: { bookId: string } }) {
  const book = await prisma.book.findUnique({
    where: {
      id: params.bookId,
    },
    include: {
      verses: {
        orderBy: {
          number: "asc",
        },
        include: {
          translations: {
            select: {
              translator: true,
            },
            distinct: ["translator"],
          },
        },
      },
    },
  })

  if (!book) {
    notFound()
  }

  // Get unique translators
  const translators = Array.from(new Set(book.verses.flatMap((verse) => verse.translations.map((t) => t.translator))))

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="max-w-4xl w-full">
        <div className="mb-6">
          <Link href="/books" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Books
          </Link>
          <h1 className="text-3xl font-bold">{book.title}</h1>
          {book.author && <p className="text-gray-600">By {book.author}</p>}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2">About this Book</h2>
          <p className="text-gray-600 mb-4">{book.description}</p>

          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Available Translators:</h3>
            <div className="flex flex-wrap gap-2">
              {translators.map((translator) => (
                <span key={translator} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {translator}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Verses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {book.verses.map((verse) => (
              <Link
                key={verse.id}
                href={`/books/${book.id}/verses/${verse.id}`}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-medium">Verse {verse.number}</h3>
                <p className="text-sm text-gray-500 mt-1">{verse.translations.length} translations available</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
