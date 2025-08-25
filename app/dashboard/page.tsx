import { db } from "@/lib/db"
import { favorites, notes } from "@/lib/schema"
import { eq } from "drizzle-orm"

export default async function DashboardPage() {
  const userId = "demo-user"

  const userFavorites = await db.query.favorites.findMany({
    where: eq(favorites.userId, userId),
    with: { book: true },
  })

  const userNotes = await db.query.notes.findMany({
    where: eq(notes.userId, userId),
    with: { verse: true },
  })

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Highlights</h2>
          <ul className="space-y-2">
            {userFavorites.map((fav) => (
              <li key={fav.id} className="p-2 border rounded">
                {fav.book.title}
              </li>
            ))}
            {userFavorites.length === 0 && (
              <p className="text-sm text-muted-foreground">No favorites yet.</p>
            )}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Notes</h2>
          <ul className="space-y-2">
            {userNotes.map((note) => (
              <li key={note.id} className="p-2 border rounded">
                <div className="font-medium">Verse {note.verse.number}</div>
                <p className="text-sm mt-1">{note.content}</p>
              </li>
            ))}
            {userNotes.length === 0 && (
              <p className="text-sm text-muted-foreground">No notes yet.</p>
            )}
          </ul>
        </section>
      </div>
    </main>
  )
}
