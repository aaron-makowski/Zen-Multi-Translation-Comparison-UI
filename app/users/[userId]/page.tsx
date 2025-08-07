import { notFound } from "next/navigation"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { db } from "@/lib/db"
import { users, notes, comments } from "@/lib/schema"
import { eq, desc, sql } from "drizzle-orm"

export const revalidate = 60

interface PageProps {
  params: { userId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

const PAGE_SIZE = 5

export default async function UserPage({ params, searchParams }: PageProps) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, params.userId),
  })

  if (!user) {
    notFound()
  }

  const notesPage = Number(searchParams?.notesPage ?? 1)
  const commentsPage = Number(searchParams?.commentsPage ?? 1)

  const [userNotes, notesCountRes] = await Promise.all([
    db.query.notes.findMany({
      where: eq(notes.userId, params.userId),
      orderBy: (notes, { desc }) => [desc(notes.createdAt)],
      limit: PAGE_SIZE,
      offset: (notesPage - 1) * PAGE_SIZE,
    }),
    db
      .select({ count: sql<number>`count(*)` })
      .from(notes)
      .where(eq(notes.userId, params.userId)),
  ])
  const notesCount = Number(notesCountRes[0]?.count || 0)
  const totalNotesPages = Math.max(1, Math.ceil(notesCount / PAGE_SIZE))

  const [userComments, commentsCountRes] = await Promise.all([
    db.query.comments.findMany({
      where: eq(comments.userId, params.userId),
      orderBy: (comments, { desc }) => [desc(comments.createdAt)],
      limit: PAGE_SIZE,
      offset: (commentsPage - 1) * PAGE_SIZE,
    }),
    db
      .select({ count: sql<number>`count(*)` })
      .from(comments)
      .where(eq(comments.userId, params.userId)),
  ])
  const commentsCount = Number(commentsCountRes[0]?.count || 0)
  const totalCommentsPages = Math.max(1, Math.ceil(commentsCount / PAGE_SIZE))

  return (
    <main className="p-4 md:p-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <section className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar ?? undefined} alt={user.username} />
            <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user.username}</h1>
            {user.bio && <p className="text-muted-foreground">{user.bio}</p>}
            <p className="text-sm text-muted-foreground">
              Joined {user.createdAt.toDateString()}
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Notes</h2>
          <ul className="space-y-2">
            {userNotes.map((note) => (
              <li key={note.id} className="p-4 border rounded-md">
                <p>{note.content}</p>
              </li>
            ))}
            {userNotes.length === 0 && (
              <li className="text-sm text-muted-foreground">No notes yet.</li>
            )}
          </ul>
          {totalNotesPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  {notesPage > 1 && (
                    <PaginationPrevious
                      href={`?notesPage=${notesPage - 1}&commentsPage=${commentsPage}`}
                    />
                  )}
                </PaginationItem>
                {Array.from({ length: totalNotesPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href={`?notesPage=${i + 1}&commentsPage=${commentsPage}`}
                      isActive={notesPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  {notesPage < totalNotesPages && (
                    <PaginationNext
                      href={`?notesPage=${notesPage + 1}&commentsPage=${commentsPage}`}
                    />
                  )}
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Comments</h2>
          <ul className="space-y-2">
            {userComments.map((comment) => (
              <li key={comment.id} className="p-4 border rounded-md">
                <p>{comment.content}</p>
              </li>
            ))}
            {userComments.length === 0 && (
              <li className="text-sm text-muted-foreground">
                No comments yet.
              </li>
            )}
          </ul>
          {totalCommentsPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  {commentsPage > 1 && (
                    <PaginationPrevious
                      href={`?notesPage=${notesPage}&commentsPage=${commentsPage - 1}`}
                    />
                  )}
                </PaginationItem>
                {Array.from({ length: totalCommentsPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href={`?notesPage=${notesPage}&commentsPage=${i + 1}`}
                      isActive={commentsPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  {commentsPage < totalCommentsPages && (
                    <PaginationNext
                      href={`?notesPage=${notesPage}&commentsPage=${commentsPage + 1}`}
                    />
                  )}
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </section>
      </div>
    </main>
  )
}

