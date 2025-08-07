import Link from "next-intl/link"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { db } from "@/lib/db"

export const revalidate = 60 // Revalidate data every 60 seconds

export default async function BooksPage() {
  const t = useTranslations("BooksPage")
  const allBooks = await db.query.books.findMany({
    orderBy: (books, { asc }) => [asc(books.title)],
  })

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>

        {allBooks.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="mb-4 text-muted-foreground">{t("empty")}</p>
            <Button asChild>
              <Link href="/api/seed" target="_blank">
                {t("seedDatabase")}
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {allBooks.map((book) => (
              <Card key={book.id} className="overflow-hidden flex flex-col">
                <div className="aspect-[3/2] relative">
                  <img
                    src={book.coverImage || "/placeholder.svg?height=300&width=450&query=zen+text+cover"}
                    alt={book.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-xl font-semibold mb-2">{book.title}</h2>
                  <p className="text-sm text-gray-600 mb-1">
                    {t("by", { author: book.author ?? t("unknownAuthor") })}
                  </p>
                  <p className="text-sm mb-4 flex-grow">{book.description}</p>
                  <Button asChild className="w-full mt-auto">
                    <Link href={`/books/${book.id}`}>{t("viewText")}</Link>
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
