import { prisma } from "@/lib/db"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, User } from "lucide-react"

export default async function BooksPage() {
  const books = await prisma.book.findMany({
    include: {
      _count: {
        select: {
          translations: true,
          chapters: true,
        },
      },
    },
    orderBy: {
      title: "asc",
    },
  })

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Zen Texts Library</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <Card key={book.id} className="overflow-hidden">
            {book.coverImage && (
              <div className="aspect-[3/2] relative">
                <img
                  src={book.coverImage || "/placeholder.svg"}
                  alt={book.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle>{book.title}</CardTitle>
              {book.originalTitle && <CardDescription>{book.originalTitle}</CardDescription>}
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {book._count.chapters} chapters
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {book._count.translations} translations
                </Badge>
                {book.language && <Badge variant="secondary">{book.language}</Badge>}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {book.description || "No description available."}
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/books/${book.id}`}>Explore</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No books available yet</h3>
          <p className="text-muted-foreground">Check back later for new additions to our library.</p>
        </div>
      )}
    </div>
  )
}
