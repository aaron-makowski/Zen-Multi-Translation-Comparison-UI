import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { BookOpen, FileText, Quote } from "lucide-react"
import { SearchForm } from "@/components/search/search-form"
import { SearchResults } from "@/components/search/search-results"

interface SearchPageProps {
  searchParams: { q?: string; type?: string }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ""
  const type = searchParams.type || "all"

  let books = []
  let verses = []
  let translations = []

  if (query.length > 2) {
    // Search for books
    books = await prisma.book.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { originalTitle: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { author: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
    })

    // Search for verses
    verses = await prisma.verse.findMany({
      where: {
        OR: [
          { originalText: { contains: query, mode: "insensitive" } },
          { romanization: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        chapter: {
          include: {
            book: true,
          },
        },
      },
      take: 20,
    })

    // Search for translations
    const lineTranslations = await prisma.lineTranslation.findMany({
      where: {
        text: { contains: query, mode: "insensitive" },
      },
      include: {
        translation: true,
        line: {
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
        },
      },
      take: 30,
    })

    // Group translations by verse and translator
    translations = lineTranslations.reduce((acc, curr) => {
      const key = `${curr.line.verse.id}-${curr.translation.id}`
      if (!acc[key]) {
        acc[key] = {
          id: key,
          verseId: curr.line.verse.id,
          verseNumber: curr.line.verse.number,
          chapterId: curr.line.verse.chapter.id,
          chapterNumber: curr.line.verse.chapter.number,
          bookId: curr.line.verse.chapter.book.id,
          bookTitle: curr.line.verse.chapter.book.title,
          translationId: curr.translation.id,
          translator: curr.translation.translator,
          year: curr.translation.year,
          lines: [],
        }
      }
      acc[key].lines.push({
        lineId: curr.line.id,
        lineNumber: curr.line.lineNumber,
        text: curr.text,
        originalText: curr.line.originalText,
      })
      return acc
    }, {})

    translations = Object.values(translations)
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Search Zen Texts</h1>
        <p className="text-muted-foreground">Search across books, verses, and translations</p>
      </div>

      <SearchForm initialQuery={query} initialType={type} />

      {query.length > 0 && (
        <div className="mt-6">
          <Tabs defaultValue={type === "all" ? "all" : type} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" asChild>
                <Link href={`/search?q=${encodeURIComponent(query)}&type=all`}>All Results</Link>
              </TabsTrigger>
              <TabsTrigger value="books" asChild>
                <Link href={`/search?q=${encodeURIComponent(query)}&type=books`}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Books
                </Link>
              </TabsTrigger>
              <TabsTrigger value="verses" asChild>
                <Link href={`/search?q=${encodeURIComponent(query)}&type=verses`}>
                  <FileText className="h-4 w-4 mr-2" />
                  Verses
                </Link>
              </TabsTrigger>
              <TabsTrigger value="translations" asChild>
                <Link href={`/search?q=${encodeURIComponent(query)}&type=translations`}>
                  <Quote className="h-4 w-4 mr-2" />
                  Translations
                </Link>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <SearchResults books={books} verses={verses} translations={translations} />
            </TabsContent>

            <TabsContent value="books" className="mt-6">
              <SearchResults books={books} verses={[]} translations={[]} />
            </TabsContent>

            <TabsContent value="verses" className="mt-6">
              <SearchResults books={[]} verses={verses} translations={[]} />
            </TabsContent>

            <TabsContent value="translations" className="mt-6">
              <SearchResults books={[]} verses={[]} translations={translations} />
            </TabsContent>
          </Tabs>
        </div>
      )}

      {query.length > 0 && books.length === 0 && verses.length === 0 && translations.length === 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>No results found</CardTitle>
            <CardDescription>Try a different search term or browse all books</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your search for "{query}" did not match any books, verses, or translations.
            </p>
            <div className="mt-4">
              <Link href="/books" className="text-primary hover:underline">
                Browse all books
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {query.length <= 2 && query.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Search term too short</CardTitle>
            <CardDescription>Please enter at least 3 characters to search</CardDescription>
          </CardHeader>
        </Card>
      )}

      {query.length === 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Search Tips</CardTitle>
            <CardDescription>How to get the most out of search</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Search for specific terms like "mind", "way", or "emptiness"</li>
              <li>Search for translator names to find their translations</li>
              <li>Search for book titles to find specific texts</li>
              <li>Use the tabs above to filter results by type</li>
              <li>Results include original text, translations, and book information</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
