import Link from "next/link"
import { translators } from "@/lib/translations"
import { getKarmaBadge } from "@/lib/karma"

interface Comment {
  id: string
  username: string
  karma: number
  content: string
  createdAt: string
}

interface Highlight {
  id: string
  username: string
  karma: number
  text: string
  createdAt: string
}

interface Featured {
  translatorId: string
  verseId: number
}

async function getLatestComments(): Promise<Comment[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/comments`, {
    next: { revalidate: 0 }
  })
  const data = await res.json()
  const all = Object.values(data as Record<string, Comment[]>).flat()
  return all.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 5)
}

async function getHighlights(): Promise<Highlight[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/highlights`, {
    next: { revalidate: 0 }
  })
  if (!res.ok) return []
  const data = (await res.json()) as Highlight[]
  return data
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    .slice(0, 5)
}

async function getFeatured() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/featured`, {
    next: { revalidate: 0 }
  })
  if (!res.ok) return null
  const data = (await res.json()) as Featured
  const translator = translators.find((t) => t.id === data.translatorId)
  return { ...data, translator }
}

export default async function FeedPage() {
  const [comments, highlights, featured] = await Promise.all([
    getLatestComments(),
    getHighlights(),
    getFeatured()
  ])

  return (
    <div className="p-4 space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-2">Latest Comments</h2>
        <ul className="space-y-2">
          {comments.map((c) => {
            const badge = getKarmaBadge(c.karma)
            return (
              <li key={c.id} className="text-sm">
                <strong>{c.username}</strong>{" "}
                <span className={`text-xs ${badge.color}`}>{badge.label}</span>: {c.content}
              </li>
            )
          })}
          {comments.length === 0 && (
            <p className="text-sm text-muted-foreground">No comments yet.</p>
          )}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Highlights</h2>
        <ul className="space-y-2">
          {highlights.map((h) => {
            const badge = getKarmaBadge(h.karma)
            return (
              <li key={h.id} className="text-sm">
                <strong>{h.username}</strong>{" "}
                <span className={`text-xs ${badge.color}`}>{badge.label}</span>: {h.text}
              </li>
            )
          })}
          {highlights.length === 0 && (
            <p className="text-sm text-muted-foreground">No highlights yet.</p>
          )}
        </ul>
      </section>

      {featured && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Featured Translation</h2>
          <p className="text-sm">
            {featured.translator ? (
              <>
                <Link href={`/translations/${featured.translator.id}`}>{featured.translator.name}</Link>
                {` – Verse ${featured.verseId}`}
              </>
            ) : (
              `${featured.translatorId} – Verse ${featured.verseId}`
            )}
          </p>
        </section>
      )}
    </div>
  )
}
