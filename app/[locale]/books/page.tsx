import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { db } from "@/lib/db"
import { useTranslations } from "next-intl"

export const revalidate = 60 // Revalidate data every 60 seconds

<<<<<<< HEAD
interface PageProps {
  searchParams: {
    q?: string
    sort?: string
  }
}

export default async function BooksPage({ searchParams }: PageProps) {
  const sort = searchParams.sort === "recent" ? "recent" : "title"
  const query = searchParams.q?.toLowerCase() ?? ""

  const allBooks = await db.query.books.findMany({
    orderBy:
      sort === "title"
        ? (books, { asc }) => [asc(books.title)]
        : (books, { desc }) => [desc(books.createdAt)],
  })
=======
export default async function BooksPage() {
  const t = useTranslations('Books')
  let allBooks = []
  try {
    allBooks = await db.query.books.findMany({
      orderBy: (books, { asc }) => [asc(books.title)],
    })
  } catch {
    allBooks = []
  }
>>>>>>> origin/codex/set-up-next-intl-with-translations

  const filteredBooks = query
    ? allBooks.filter((book) => book.title.toLowerCase().includes(query))
    : allBooks

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>

        <form className="flex flex-col md:flex-row gap-2 mb-6" action="" method="get">
          <Input name="q" placeholder="Search books" defaultValue={searchParams.q || ""} />
          <Select name="sort" defaultValue={sort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="recent">Newest</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit">Apply</Button>
        </form>

        {filteredBooks.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="mb-4 text-muted-foreground">{t('empty')}</p>
            <Button asChild>
              <Link href="/api/seed" target="_blank">
                {t('seed')}
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {filteredBooks.map((book) => (
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
                  <p className="text-sm text-gray-600 mb-1">By: {book.author || "Unknown"}</p>
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
