<<<<<<< HEAD
<<<<<<< HEAD
import { BookmarkButton } from "@/components/bookmark-button"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { verses } from "@/lib/translations"

export const revalidate = 60

interface PageProps {
  searchParams: {
    q?: string
    sort?: string
  }
}

export default function FeedPage({ searchParams }: PageProps) {
  const query = searchParams.q?.toLowerCase() ?? ""
  const sort = searchParams.sort === "desc" ? "desc" : "asc"

  const filtered = verses
    .filter((v) => {
      if (!query) return true
      return v.lines.some((line) =>
        Object.values(line.translations).some((text) => text.toLowerCase().includes(query))
      )
    })
    .sort((a, b) => (sort === "asc" ? a.id - b.id : b.id - a.id))

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold mb-6">Zen Feed</h1>

        <form className="flex flex-col md:flex-row gap-2 mb-6" action="" method="get">
          <Input name="q" placeholder="Search translations" defaultValue={searchParams.q || ""} />
          <Select name="sort" defaultValue={sort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Verse Asc</SelectItem>
              <SelectItem value="desc">Verse Desc</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit">Apply</Button>
        </form>

        <div className="space-y-4">
          {filtered.map((verse) => (
            <div key={verse.id} className="border rounded p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold">Verse {verse.id}</h2>
                <BookmarkButton verseId={verse.id.toString()} />
              </div>
              {verse.lines[0] && (
                <p className="text-sm">
                  {Object.values(verse.lines[0].translations)[0] || "Translation not available."}
                </p>
              )}
            </div>
          ))}
        </div>
=======
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"

export const revalidate = 60

export default async function FeedPage({
  searchParams,
}: {
  searchParams?: { sort?: string; tag?: string }
}) {
  const sort = searchParams?.sort === "asc" ? "asc" : "desc"
  const tag = searchParams?.tag ? String(searchParams.tag) : ""

  const data = await db.query.verses.findMany({
    with: {
      book: true,
      verseTags: {
        with: {
          tag: true,
        },
      },
    },
    orderBy: (verses, { asc, desc }) => [
      sort === "asc" ? asc(verses.createdAt) : desc(verses.createdAt),
    ],
  })

  const verses = tag
    ? data.filter((v) => v.verseTags.some((t) => t.tag.name === tag))
    : data

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Feed</h1>
      <form className="flex gap-2 mb-4">
        <input
          type="text"
          name="tag"
          placeholder="Filter by tag"
          defaultValue={tag}
          className="flex-1 border rounded p-2 text-sm"
        />
        <select
          name="sort"
          defaultValue={sort}
          className="border rounded p-2 text-sm"
        >
          <option value="desc">Newest</option>
          <option value="asc">Oldest</option>
        </select>
        <Button type="submit" size="sm">
          Apply
        </Button>
      </form>
      <div className="space-y-4">
        {verses.map((verse) => (
          <div key={verse.id} className="border rounded p-4">
            <div className="text-sm text-muted-foreground mb-2">
              {verse.book.title} – Verse {verse.number}
            </div>
            {verse.verseTags.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {verse.verseTags.map((t) => (
                  <span
                    key={t.tagId}
                    className="text-xs bg-muted px-2 py-1 rounded"
                  >
                    {t.tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        {verses.length === 0 && (
          <p className="text-sm text-muted-foreground">No verses found.</p>
        )}
>>>>>>> origin/codex/create-tags-table-and-many-to-many-relation
      </div>
    </main>
=======
import { promises as fs } from "fs"
import path from "path"
import { getBadge } from "@/lib/karma"
import { translators, verses } from "@/lib/translations"
import { TranslationCard } from "@/components/translation-card"

interface Highlight {
  id: string
  verseId: number
  text: string
  createdAt: string
}

async function getFeedData() {
  const dataDir = path.join(process.cwd(), "data")
  const [commentsRaw, highlightsRaw, featuredRaw] = await Promise.all([
    fs.readFile(path.join(dataDir, "comments.json"), "utf8").catch(() => "{}"),
    fs.readFile(path.join(dataDir, "highlights.json"), "utf8").catch(() => "[]"),
    fs.readFile(path.join(dataDir, "featured.json"), "utf8").catch(() => "{}"),
  ])
  const commentsData = JSON.parse(commentsRaw || "{}") as Record<string, any[]>
  const comments = Object.values(commentsData)
    .flat()
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
  const highlights: Highlight[] = JSON.parse(highlightsRaw || "[]")
  const featured = JSON.parse(featuredRaw || "{}")
  return { comments, highlights, featured }
}

export default async function FeedPage() {
  const { comments, highlights, featured } = await getFeedData()
  const translator = translators.find((t) => t.id === featured.translatorId)
  const verse = verses[0]

  return (
    <div className="space-y-8 p-4">
      <section>
        <h2 className="text-xl font-semibold mb-4">Latest Comments</h2>
        <div className="space-y-2">
          {comments.map((c: any) => (
            <div key={c.id} className="p-2 border rounded">
              <p className="text-sm">{c.content}</p>
              <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                <span className="flex items-center gap-1">
                  {c.username || "Anonymous"}
                  {(() => {
                    const badge = getBadge(c.votes)
                    return <span className={badge.className}>{badge.label}</span>
                  })()}
                </span>
                <span>{new Date(c.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-sm text-muted-foreground">No comments yet.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Highlights</h2>
        <div className="space-y-2">
          {highlights
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
            .map((h) => (
              <div key={h.id} className="p-2 border rounded">
                <p className="text-sm">{h.text}</p>
                <div className="text-xs text-muted-foreground">
                  {new Date(h.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          {highlights.length === 0 && (
            <p className="text-sm text-muted-foreground">No highlights yet.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Featured Translation</h2>
        {translator ? (
          <div className="space-y-2">
            <p className="text-sm">
              {translator.name} ({translator.year})
            </p>
            <TranslationCard verse={verse} translator={translator} compact />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No featured translation selected.</p>
        )}
      </section>
    </div>
>>>>>>> origin/codex/add-page-to-pull-latest-comments-and-highlights
  )
}
