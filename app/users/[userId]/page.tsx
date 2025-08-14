<<<<<<< HEAD
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
=======
import Image from "next/image"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { users, notes as notesTable, comments as commentsTable } from "@/lib/schema"
import { eq, desc, count } from "drizzle-orm"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export const revalidate = 60

const PAGE_SIZE = 10

interface UserPageProps {
  params: { userId: string }
  searchParams?: { notesPage?: string; commentsPage?: string }
}

export default async function UserPage({ params, searchParams }: UserPageProps) {
>>>>>>> origin/codex/add-user-profile-page-with-follow-feature
  const user = await db.query.users.findFirst({
    where: eq(users.id, params.userId),
  })

  if (!user) {
    notFound()
  }

<<<<<<< HEAD
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
=======
  const notesPage = Number(searchParams?.notesPage ?? 1)
  const commentsPage = Number(searchParams?.commentsPage ?? 1)

  const [notes, notesCountResult] = await Promise.all([
    db
      .select()
      .from(notesTable)
      .where(eq(notesTable.userId, params.userId))
      .limit(PAGE_SIZE)
      .offset((notesPage - 1) * PAGE_SIZE)
      .orderBy(desc(notesTable.createdAt)),
    db
      .select({ value: count() })
      .from(notesTable)
      .where(eq(notesTable.userId, params.userId)),
  ])

  const [comments, commentsCountResult] = await Promise.all([
    db
      .select()
      .from(commentsTable)
      .where(eq(commentsTable.userId, params.userId))
      .limit(PAGE_SIZE)
      .offset((commentsPage - 1) * PAGE_SIZE)
      .orderBy(desc(commentsTable.createdAt)),
    db
      .select({ value: count() })
      .from(commentsTable)
      .where(eq(commentsTable.userId, params.userId)),
  ])

  const notesTotalPages = Math.max(1, Math.ceil((notesCountResult[0]?.value || 0) / PAGE_SIZE))
  const commentsTotalPages = Math.max(1, Math.ceil((commentsCountResult[0]?.value || 0) / PAGE_SIZE))

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="max-w-3xl w-full space-y-8">
        <div className="flex items-center gap-4">
          {user.avatar && (
            <Image
              src={user.avatar}
              alt={user.username}
              width={64}
              height={64}
              className="rounded-full"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">{user.username}</h1>
            <p className="text-muted-foreground">
              Joined {user.createdAt.toDateString()}
            </p>
          </div>
        </div>
        {user.bio && <p>{user.bio}</p>}

        <section>
          <h2 className="text-xl font-semibold mb-2">Notes</h2>
          <ul className="space-y-2">
            {notes.map((note) => (
              <li key={note.id} className="border rounded p-2">
                {note.content}
              </li>
            ))}
          </ul>
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={`?notesPage=${Math.max(1, notesPage - 1)}&commentsPage=${commentsPage}`}
                  className={notesPage <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href={`?notesPage=${Math.min(notesTotalPages, notesPage + 1)}&commentsPage=${commentsPage}`}
                  className={notesPage >= notesTotalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Comments</h2>
          <ul className="space-y-2">
            {comments.map((comment) => (
              <li key={comment.id} className="border rounded p-2">
                {comment.content}
              </li>
            ))}
          </ul>
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={`?notesPage=${notesPage}&commentsPage=${Math.max(1, commentsPage - 1)}`}
                  className={commentsPage <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href={`?notesPage=${notesPage}&commentsPage=${Math.min(commentsTotalPages, commentsPage + 1)}`}
                  className={commentsPage >= commentsTotalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </section>
      </div>
    </main>
  )
}
>>>>>>> origin/codex/add-user-profile-page-with-follow-feature
