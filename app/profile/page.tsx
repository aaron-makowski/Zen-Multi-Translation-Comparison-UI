import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { BookOpen, Heart, MessageSquare, PenSquare, Settings } from "lucide-react"

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?return_to=/profile")
  }

  // Get user's favorites
  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    include: { book: true },
    orderBy: { createdAt: "desc" },
  })

  // Get user's comments
  const comments = await prisma.comment.findMany({
    where: { userId: user.id },
    include: {
      book: true,
      verse: {
        include: {
          chapter: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  // Get user's notes
  const notes = await prisma.note.findMany({
    where: { userId: user.id },
    include: {
      verse: {
        include: {
          chapter: {
            include: {
              book: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  function getInitials(name: string | null) {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
            <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{user.name || "User"}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/profile/settings">
            <Settings className="h-4 w-4 mr-2" /> Edit Profile
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="activity" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-1">
            <Heart className="h-4 w-4" /> Favorites
          </TabsTrigger>
          <TabsTrigger value="comments" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" /> Comments
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-1">
            <PenSquare className="h-4 w-4" /> Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2" /> Favorites
                </CardTitle>
                <CardDescription>Books you've favorited</CardDescription>
              </CardHeader>
              <CardContent>
                {favorites.length > 0 ? (
                  <ul className="space-y-2">
                    {favorites.slice(0, 5).map((favorite) => (
                      <li key={favorite.id} className="text-sm">
                        <Link href={`/books/${favorite.book?.id}`} className="hover:underline">
                          {favorite.book?.title}
                        </Link>
                      </li>
                    ))}
                    {favorites.length > 5 && (
                      <li className="text-xs text-muted-foreground">+ {favorites.length - 5} more favorites</li>
                    )}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No favorites yet</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" /> Recent Comments
                </CardTitle>
                <CardDescription>Your recent comments</CardDescription>
              </CardHeader>
              <CardContent>
                {comments.length > 0 ? (
                  <ul className="space-y-2">
                    {comments.slice(0, 5).map((comment) => (
                      <li key={comment.id} className="text-sm">
                        <div className="font-medium">
                          <Link
                            href={
                              comment.verse
                                ? `/books/${comment.book?.id}/verses/${comment.verse.id}`
                                : `/books/${comment.book?.id}`
                            }
                            className="hover:underline"
                          >
                            {comment.book?.title}{" "}
                            {comment.verse && `- Ch ${comment.verse.chapter.number}, V ${comment.verse.number}`}
                          </Link>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{comment.text}</p>
                      </li>
                    ))}
                    {comments.length > 5 && (
                      <li className="text-xs text-muted-foreground">+ {comments.length - 5} more comments</li>
                    )}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No comments yet</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PenSquare className="h-5 w-5 mr-2" /> Recent Notes
                </CardTitle>
                <CardDescription>Your personal notes</CardDescription>
              </CardHeader>
              <CardContent>
                {notes.length > 0 ? (
                  <ul className="space-y-2">
                    {notes.slice(0, 5).map((note) => (
                      <li key={note.id} className="text-sm">
                        <div className="font-medium">
                          <Link
                            href={`/books/${note.verse.chapter.book.id}/verses/${note.verse.id}`}
                            className="hover:underline"
                          >
                            {note.verse.chapter.book.title} - Ch {note.verse.chapter.number}, V {note.verse.number}
                          </Link>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{note.text}</p>
                      </li>
                    ))}
                    {notes.length > 5 && (
                      <li className="text-xs text-muted-foreground">+ {notes.length - 5} more notes</li>
                    )}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No notes yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.length > 0 ? (
              favorites.map((favorite) => (
                <Card key={favorite.id}>
                  <CardHeader>
                    <CardTitle>
                      <Link href={`/books/${favorite.book?.id}`} className="hover:underline">
                        {favorite.book?.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      {favorite.book?.author} {favorite.book?.year && `(${favorite.book.year})`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      {favorite.book?.description?.slice(0, 100)}
                      {favorite.book?.description && favorite.book.description.length > 100 ? "..." : ""}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Favorited {formatDistanceToNow(new Date(favorite.createdAt), { addSuffix: true })}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                <p className="text-muted-foreground mb-4">
                  When you favorite a book, it will appear here for easy access.
                </p>
                <Button asChild>
                  <Link href="/books">Browse Books</Link>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="comments" className="mt-6">
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">
                          <Link
                            href={
                              comment.verse
                                ? `/books/${comment.book?.id}/verses/${comment.verse.id}`
                                : `/books/${comment.book?.id}`
                            }
                            className="hover:underline"
                          >
                            {comment.book?.title}{" "}
                            {comment.verse &&
                              `- Chapter ${comment.verse.chapter.number}, Verse ${comment.verse.number}`}
                          </Link>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No comments yet</h3>
                <p className="text-muted-foreground mb-4">When you comment on a book or verse, it will appear here.</p>
                <Button asChild>
                  <Link href="/books">Browse Books</Link>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <div className="space-y-4">
            {notes.length > 0 ? (
              notes.map((note) => (
                <Card key={note.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">
                          <Link
                            href={`/books/${note.verse.chapter.book.id}/verses/${note.verse.id}`}
                            className="hover:underline"
                          >
                            {note.verse.chapter.book.title} - Chapter {note.verse.chapter.number}, Verse{" "}
                            {note.verse.number}
                          </Link>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{note.text}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <PenSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No notes yet</h3>
                <p className="text-muted-foreground mb-4">
                  When you add personal notes to verses, they will appear here.
                </p>
                <Button asChild>
                  <Link href="/books">Browse Books</Link>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
