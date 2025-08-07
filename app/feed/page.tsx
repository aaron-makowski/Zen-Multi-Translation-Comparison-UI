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
  )
}
