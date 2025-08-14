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
      </div>
    </main>
  )
}
