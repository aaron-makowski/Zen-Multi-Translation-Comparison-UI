import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { BookOpen, Heart, MessageSquare, PenSquare } from "lucide-react"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Get user's favorites
  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: { book: true },
    take: 5,
  })

  // Get user's recent comments
  const comments = await prisma.comment.findMany({
    where: { userId: user.id },
    include: { book: true, verse: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  // Get user's recent notes
  const notes = await prisma.note.findMany({
    where: { userId: user.id },
    include: { verse: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.name || "User"}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Recent Books
            </CardTitle>
            <CardDescription>Books you've recently viewed</CardDescription>
          </CardHeader>
          <CardContent>
            {favorites.length > 0 ? (
              <ul className="space-y-2">
                {favorites.map((favorite) => (
                  <li key={favorite.id} className="text-sm">
                    <Link href={`/books/${favorite.book?.id}`} className="hover:underline">
                      {favorite.book?.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No recent books</p>
            )}
            <div className="mt-4">
              <Link href="/books" className="text-sm text-primary hover:underline">
                Browse all books
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="mr-2 h-5 w-5" />
              Favorites
            </CardTitle>
            <CardDescription>Your favorite books</CardDescription>
          </CardHeader>
          <CardContent>
            {favorites.length > 0 ? (
              <ul className="space-y-2">
                {favorites.map((favorite) => (
                  <li key={favorite.id} className="text-sm">
                    <Link href={`/books/${favorite.book?.id}`} className="hover:underline">
                      {favorite.book?.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No favorites yet</p>
            )}
            <div className="mt-4">
              <Link href="/favorites" className="text-sm text-primary hover:underline">
                View all favorites
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Recent Comments
            </CardTitle>
            <CardDescription>Your recent comments</CardDescription>
          </CardHeader>
          <CardContent>
            {comments.length > 0 ? (
              <ul className="space-y-2">
                {comments.map((comment) => (
                  <li key={comment.id} className="text-sm">
                    <div className="font-medium">
                      {comment.book?.title} {comment.verse && `- Verse ${comment.verse.number}`}
                    </div>
                    <p className="text-muted-foreground truncate">{comment.text}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No comments yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PenSquare className="mr-2 h-5 w-5" />
              Your Notes
            </CardTitle>
            <CardDescription>Your personal notes on verses</CardDescription>
          </CardHeader>
          <CardContent>
            {notes.length > 0 ? (
              <ul className="space-y-4">
                {notes.map((note) => (
                  <li key={note.id} className="border-b pb-3 last:border-0 last:pb-0">
                    <div className="font-medium mb-1">Verse {note.verse.number}</div>
                    <p className="text-sm">{note.text}</p>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No notes yet</p>
            )}
            <div className="mt-4">
              <Link href="/notes" className="text-sm text-primary hover:underline">
                View all notes
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
