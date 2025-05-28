import Link from "next/link"
import { prisma } from "@/lib/db"
import { Button } from "@/components/ui/button"

export default async function BooksPage() {
  const books = await prisma.book.findMany({
    orderBy: {
      title: "asc",
    },
  })

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold mb-6">Books</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {books.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{book.title}</h2>
                <p className="text-gray-600 mb-4">{book.description}</p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">{book.author && <p>By {book.author}</p>}</div>
                  <Link href={`/books/${book.id}`} passHref>
                    <Button>View Book</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {books.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No books found. Please make sure the database is seeded.</p>
            <Link href="/" passHref>
              <Button>Return Home</Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
