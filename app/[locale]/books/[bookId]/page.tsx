import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { db } from "@/lib/db"
import { books } from "@/lib/schema"
import { eq } from "drizzle-orm"
import VerseList from "@/components/verse-list"

export const revalidate = 60

export default async function BookPage({ params }: { params: { bookId: string } }) {
  const book = await db.query.books.findFirst({
    where: eq(books.id, params.bookId),
  })

  if (!book) {
    notFound()
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="max-w-4xl w-full">
        <div className="flex items-center gap-2 mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/books">← Back to Books</Link>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="md:w-1/3">
            <Card className="overflow-hidden sticky top-24">
              <div className="aspect-[3/4] relative">
                <img
                  src={book.coverImage || "/placeholder.svg?height=450&width=300&query=zen+text+cover"}
                  alt={book.title}
                  className="object-cover w-full h-full"
                />
              </div>
            </Card>
          </div>
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-muted-foreground mb-4">By: {book.author || "Unknown"}</p>
            <div className="prose max-w-none mb-6">
              <p>{book.description}</p>
            </div>

            <h2 className="text-2xl font-semibold mb-4 border-t pt-4">Verses</h2>
            <VerseList bookId={book.id} />
          </div>
        </div>
      </div>
    </main>
  )
}
