import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BookmarkButton } from "@/components/bookmark-button"
import { db } from "@/lib/db"

export const revalidate = 60 // Revalidate data every 60 seconds

export default async function BooksPage({
  searchParams,
}: {
  searchParams?: { sort?: string; q?: string }
}) {
  const sort = searchParams?.sort === "desc" ? "desc" : "asc"
  const q = searchParams?.q ? String(searchParams.q) : ""

  const allBooks = await db.query.books.findMany({
    where: q
      ? (books, { ilike }) => ilike(books.title, `%${q}%`)
      : undefined,
    orderBy: (books, { asc, desc }) => [
      sort === "desc" ? desc(books.title) : asc(books.title),
    ],
  })

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold mb-6">Zen Texts Library</h1>
        <form className="flex gap-2 mb-6">
          <input
            type="text"
            name="q"
            placeholder="Search by title"
            defaultValue={q}
            className="flex-1 border rounded p-2 text-sm"
          />
          <select
            name="sort"
            defaultValue={sort}
            className="border rounded p-2 text-sm"
          >
            <option value="asc">Title A-Z</option>
            <option value="desc">Title Z-A</option>
          </select>
          <Button type="submit" size="sm">
            Apply
          </Button>
        </form>

        {allBooks.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="mb-4 text-muted-foreground">
              The library is currently empty. Try seeding the database.
            </p>
            <Button asChild>
              <Link href="/api/seed" target="_blank">
                Seed Database
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {allBooks.map((book) => (
              <Card key={book.id} className="overflow-hidden flex flex-col">
                <div className="aspect-[3/2] relative">
                  <img
                    src={
                      book.coverImage ||
                      "/placeholder.svg?height=300&width=450&query=zen+text+cover"
                    }
                    alt={book.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-xl font-semibold">{book.title}</h2>
                    <BookmarkButton bookId={book.id} />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    By: {book.author || "Unknown"}
                  </p>
                  <p className="text-sm mb-4 flex-grow">{book.description}</p>
                  <Button asChild className="w-full mt-auto">
                    <Link href={`/books/${book.id}`}>View Text</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
