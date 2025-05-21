import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { BookOpen, FileText, Quote } from "lucide-react"

interface Book {
  id: string
  title: string
  originalTitle: string | null
  description: string | null
  author: string | null
  year: string | null
}

interface Verse {
  id: string
  number: number
  originalText: string
  romanization: string | null
  chapter: {
    id: string
    number: number
    book: {
      id: string
      title: string
    }
  }
}

interface Translation {
  id: string
  verseId: string
  verseNumber: number
  chapterId: string
  chapterNumber: number
  bookId: string
  bookTitle: string
  translationId: string
  translator: string
  year: string | null
  lines: {
    lineId: string
    lineNumber: number
    text: string
    originalText: string
  }[]
}

interface SearchResultsProps {
  books: Book[]
  verses: Verse[]
  translations: Translation[]
}

export function SearchResults({ books, verses, translations }: SearchResultsProps) {
  const hasResults = books.length > 0 || verses.length > 0 || translations.length > 0

  if (!hasResults) {
    return null
  }

  return (
    <div className="space-y-6">
      {books.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-3 flex items-center">
            <BookOpen className="h-5 w-5 mr-2" /> Books
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {books.map((book) => (
              <Card key={book.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    <Link href={`/books/${book.id}`} className="hover:underline">
                      {book.title}
                    </Link>
                  </CardTitle>
                  {book.originalTitle && <CardDescription>{book.originalTitle}</CardDescription>}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {book.description || "No description available."}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {book.author && <Badge variant="outline">{book.author}</Badge>}
                    {book.year && <Badge variant="outline">{book.year}</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {verses.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-3 flex items-center">
            <FileText className="h-5 w-5 mr-2" /> Verses
          </h2>
          <div className="space-y-3">
            {verses.map((verse) => (
              <Card key={verse.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex justify-between">
                    <Link
                      href={`/books/${verse.chapter.book.id}/verses/${verse.id}`}
                      className="hover:underline flex-1"
                    >
                      {verse.chapter.book.title} - Chapter {verse.chapter.number}, Verse {verse.number}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-medium mb-1">{verse.originalText}</div>
                  {verse.romanization && <div className="text-xs text-muted-foreground">{verse.romanization}</div>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {translations.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-3 flex items-center">
            <Quote className="h-5 w-5 mr-2" /> Translations
          </h2>
          <div className="space-y-3">
            {translations.map((translation) => (
              <Card key={translation.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex justify-between">
                    <Link
                      href={`/books/${translation.bookId}/verses/${translation.verseId}?translator=${translation.translationId}`}
                      className="hover:underline flex-1"
                    >
                      {translation.bookTitle} - Chapter {translation.chapterNumber}, Verse {translation.verseNumber}
                    </Link>
                    <Badge variant="outline" className="ml-2">
                      {translation.translator} {translation.year && `(${translation.year})`}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {translation.lines.map((line) => (
                      <div key={line.lineId} className="text-sm">
                        <div className="text-xs text-muted-foreground mb-0.5">{line.originalText}</div>
                        {line.text}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
