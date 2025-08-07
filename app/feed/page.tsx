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
      </div>
    </main>
  )
}
