import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { db } from "@/lib/db"
import { comments, notes, users } from "@/lib/schema"
import { eq, desc } from "drizzle-orm"
import Link from "next/link"
import { notFound } from "next/navigation"

const PAGE_SIZE = 5

interface PageProps {
  params: { userId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function UserPage({ params, searchParams }: PageProps) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, params.userId),
  })

  if (!user) {
    notFound()
  }

  const notesPage = Number((searchParams.notesPage as string) || "1")
  const commentsPage = Number((searchParams.commentsPage as string) || "1")

  const userNotes = await db.query.notes.findMany({
    where: eq(notes.userId, params.userId),
    orderBy: (n, { desc }) => [desc(n.createdAt)],
    limit: PAGE_SIZE,
    offset: (notesPage - 1) * PAGE_SIZE,
  })

  const userComments = await db.query.comments.findMany({
    where: eq(comments.userId, params.userId),
    orderBy: (c, { desc }) => [desc(c.createdAt)],
    limit: PAGE_SIZE,
    offset: (commentsPage - 1) * PAGE_SIZE,
  })

  return (
    <main className="max-w-2xl mx-auto p-4 space-y-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          {user.avatarUrl ? (
            <AvatarImage src={user.avatarUrl} alt={user.username} />
          ) : (
            <AvatarFallback>
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">@{user.username}</h1>
          {user.bio && <p className="text-muted-foreground">{user.bio}</p>}
          <p className="text-sm text-muted-foreground">
            Joined {user.createdAt.toLocaleDateString()}
          </p>
        </div>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-2">Notes</h2>
        <ul className="space-y-2">
          {userNotes.map((note) => (
            <li key={note.id} className="border p-2 rounded">
              {note.content}
            </li>
          ))}
        </ul>
        <div className="flex justify-between mt-2">
          {notesPage > 1 ? (
            <Link
              href={`/users/${params.userId}?notesPage=${notesPage - 1}&commentsPage=${commentsPage}`}
              className="text-sm"
            >
              Previous
            </Link>
          ) : (
            <span />
          )}
          {userNotes.length === PAGE_SIZE && (
            <Link
              href={`/users/${params.userId}?notesPage=${notesPage + 1}&commentsPage=${commentsPage}`}
              className="text-sm"
            >
              Next
            </Link>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Comments</h2>
        <ul className="space-y-2">
          {userComments.map((comment) => (
            <li key={comment.id} className="border p-2 rounded">
              {comment.content}
            </li>
          ))}
        </ul>
        <div className="flex justify-between mt-2">
          {commentsPage > 1 ? (
            <Link
              href={`/users/${params.userId}?notesPage=${notesPage}&commentsPage=${commentsPage - 1}`}
              className="text-sm"
            >
              Previous
            </Link>
          ) : (
            <span />
          )}
          {userComments.length === PAGE_SIZE && (
            <Link
              href={`/users/${params.userId}?notesPage=${notesPage}&commentsPage=${commentsPage + 1}`}
              className="text-sm"
            >
              Next
            </Link>
          )}
        </div>
      </section>
    </main>
  )
}

export const revalidate = 60
