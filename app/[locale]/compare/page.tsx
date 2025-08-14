<<<<<<< HEAD
import Link from "next-intl/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { db } from "@/lib/db"
=======
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { db } from "@/lib/db"
import { asc } from "drizzle-orm"
>>>>>>> origin/codex/set-up-next-intl-with-translations

export const revalidate = 60

export default async function ComparePage() {
  const allBooks = await db.query.books.findMany({
    orderBy: (b, { asc }) => [asc(b.title)],
  })

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="max-w-4xl w-full">
<<<<<<< HEAD
        <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>

        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{t("selectText")}</h2>
=======
        <h1 className="text-3xl font-bold mb-6">Compare Texts</h1>

        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Select a text</h2>
>>>>>>> origin/codex/set-up-next-intl-with-translations
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allBooks.map((book) => (
              <Button key={book.id} asChild className="h-auto py-4">
                <Link href={`/books/${book.id}`}>
                  <div className="text-left">
                    <div className="font-medium">{book.title}</div>
                    {book.description && (
                      <div className="text-sm opacity-80">{book.description}</div>
                    )}
                  </div>
                </Link>
              </Button>
            ))}
          </div>
        </Card>
<<<<<<< HEAD

        <div className="mt-8">
          <Button asChild variant="outline">
            <Link href="/">{tCommon("returnHome")}</Link>
          </Button>
        </div>
=======
>>>>>>> origin/codex/set-up-next-intl-with-translations
      </div>
    </main>
  )
}
