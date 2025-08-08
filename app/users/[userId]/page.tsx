import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { eq } from "drizzle-orm"

export default async function UserDashboard({ params }: { params: { userId: string } }) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, params.userId),
    with: {
      favorites: { with: { book: true } },
      notes: { with: { verse: { with: { book: true } } } },
    },
  })

  if (!user) {
    notFound()
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-6">{user.username}'s Dashboard</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Highlights</h2>
          {user.favorites.length === 0 && (
            <p className="text-sm text-gray-500">No favorites yet.</p>
          )}
          <ul className="space-y-2">
            {user.favorites.map((fav) => (
              <li key={fav.id}>
                <Link href={`/books/${fav.bookId}`}>{fav.book.title}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Notes</h2>
          {user.notes.length === 0 && (
            <p className="text-sm text-gray-500">No notes yet.</p>
          )}
          <ul className="space-y-2">
            {user.notes.map((note) => (
              <li key={note.id}>
                <Link href={`/books/${note.verse.bookId}/verses/${note.verseId}`}>
                  Verse {note.verse.number} - {note.verse.book.title}
                </Link>: {note.content}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
