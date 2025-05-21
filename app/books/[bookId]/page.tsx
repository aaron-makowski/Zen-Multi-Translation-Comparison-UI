import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BookOpen, Heart } from "lucide-react"
import { FavoriteButton } from "@/components/books/favorite-button"
import { CommentSection } from "@/components/books/comment-section"

export default async function BookPage({ params }: { params: { bookId: string } }) {
  const user = await getCurrentUser()

  const book = await prisma.book.findUnique({
    where: { id: params.bookId },
    include: {
      chapters: {
        orderBy: { number: "asc" },
        include: {
          verses: {
            orderBy: { number: "asc" },
          },
        },
      },
      translations: {
        orderBy: { title: "asc" },
      },
      comments: {
        where: { verseId: null },
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        take: 10,
      },
      _count: {
        select: {
          favorites: true,
          comments: true,
        },
      },
    },
  })

  if (!book) {
    notFound()
  }

  // Check if user has favorited this book
  let isFavorited = false
  if (user) {
    const favorite = await prisma.favorite.findFirst({
      where: {
        userId: user.id,
        bookId: book.id,
      },
    })
    isFavorited = !!favorite
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Link href="/books" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft size={16} className="mr-1" /> Back to Books
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{book.title}</h1>
            {book.originalTitle && <p className="text-lg text-muted-foreground">{book.originalTitle}</p>}
          </div>

          {user ? (
            <FavoriteButton bookId={book.id} initialFavorited={isFavorited} />
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link href={`/login?return_to=/books/${book.id}`}>Sign in to favorite</Link>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          {book.author && <div>Author: {book.author}</div>}
          {book.year && <div>Year: {book.year}</div>}
          {book.language && <div>Original Language: {book.language}</div>}
        </div>

        {book.description && <p className="mt-4 text-muted-foreground">{book.description}</p>}

        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1 text-sm">
            <Heart className="h-4 w-4" />
            <span>{book._count.favorites} favorites</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <BookOpen className="h-4 w-4" />
            <span>{book.chapters.length} chapters</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="chapters" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chapters">Chapters & Verses</TabsTrigger>
          <TabsTrigger value="translations">Translations</TabsTrigger>
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
        </TabsList>

        <TabsContent value="chapters" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {book.chapters.map((chapter) => (
              <Card key={chapter.id}>
                <CardHeader>
                  <CardTitle>
                    Chapter {chapter.number}: {chapter.title || `Chapter ${chapter.number}`}
                  </CardTitle>
                  <CardDescription>{chapter.verses.length} verses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {chapter.verses.slice(0, 5).map((verse) => (
                      <li key={verse.id}>
                        <Link href={`/books/${book.id}/verses/${verse.id}`} className="text-sm hover:underline">
                          Verse {verse.number}
                        </Link>
                      </li>
                    ))}
                    {chapter.verses.length > 5 && (
                      <li className="text-sm text-muted-foreground">+ {chapter.verses.length - 5} more verses</li>
                    )}
                  </ul>
                  <div className="mt-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/books/${book.id}/chapters/${chapter.id}`}>View Chapter</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {book.chapters.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No chapters available yet</h3>
              <p className="text-muted-foreground">Check back later for content updates.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="translations" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {book.translations.map((translation) => (
              <Card key={translation.id}>
                <CardHeader>
                  <CardTitle>{translation.title}</CardTitle>
                  <CardDescription>
                    By {translation.translator} ({translation.year || "Unknown"})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {translation.description || "No description available."}
                  </p>
                  <div className="mt-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/books/${book.id}/translations/${translation.id}`}>View Translation</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {book.translations.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No translations available yet</h3>
              <p className="text-muted-foreground">Check back later for new translations.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="discussion" className="mt-6">
          <CommentSection bookId={book.id} comments={book.comments} currentUser={user} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
