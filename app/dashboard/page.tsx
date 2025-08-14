import { db } from "@/lib/db"
import { favorites, notes, books } from "@/lib/schema"
import { eq } from "drizzle-orm"

interface Props {
  searchParams: { userId?: string }
}

export default async function DashboardPage({ searchParams }: Props) {
  const userId = searchParams.userId
  if (!userId) {
    return <div className="p-4">No user specified</div>
  }

  const favs = await db
    .select({ id: favorites.id, title: books.title })
    .from(favorites)
    .leftJoin(books, eq(favorites.bookId, books.id))
    .where(eq(favorites.userId, userId))

  const userNotes = await db
    .select({ id: notes.id, content: notes.content })
    .from(notes)
    .where(eq(notes.userId, userId))

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Your Dashboard</h1>
      <section>
        <h2 className="text-xl font-semibold">Highlights</h2>
        <ul>
          {favs.map((f) => (
            <li key={f.id}>{f.title}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold">Notes</h2>
        <ul>
          {userNotes.map((n) => (
            <li key={n.id}>{n.content}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
