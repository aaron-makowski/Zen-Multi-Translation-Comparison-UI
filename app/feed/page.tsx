import { formatKarmaBadge } from "@/lib/karma"
import { headers } from "next/headers"

export const dynamic = "force-dynamic"

function flattenComments(data: Record<string, any[]>): any[] {
  return Object.values(data).flat().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export default async function FeedPage() {
  const headersList = headers()
  const protocol = headersList.get("x-forwarded-proto") ?? "http"
  const host = headersList.get("host") ?? "localhost:3000"
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`

  const [commentsRes, highlightsRes, featuredRes] = await Promise.all([
    fetch(`${baseUrl}/api/comments`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/highlights`, { cache: "no-store" }),
    fetch(`${baseUrl}/api/featured`, { cache: "no-store" }),
  ])

  const commentsData = await commentsRes.json()
  const comments = flattenComments(commentsData).slice(0, 5)
  const highlights = await highlightsRes.json()
  const featured = await featuredRes.json()

  return (
    <div className="space-y-8 p-4">
      <section>
        <h2 className="text-xl font-bold mb-2">Latest Comments</h2>
        <ul className="space-y-2">
          {comments.map((c: any) => (
            <li key={c.id} className="text-sm">
              <span className="font-medium">{c.user.name}</span>
              <span className="ml-1 text-xs text-muted-foreground">
                {formatKarmaBadge(c.user.karma)}
              </span>
              : {c.content}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-bold mb-2">Highlights</h2>
        <ul className="space-y-2">
          {highlights.map((h: any) => (
            <li key={h.id} className="text-sm">
              <span className="font-medium">{h.user.name}</span>
              <span className="ml-1 text-xs text-muted-foreground">
                {formatKarmaBadge(h.user.karma)}
              </span>
              : {h.content}
            </li>
          ))}
        </ul>
      </section>
      {featured && featured.translator && (
        <section>
          <h2 className="text-xl font-bold mb-2">Featured Translation</h2>
          <div className="text-sm">
            {featured.translator.name} ({featured.translator.year})
          </div>
        </section>
      )}
    </div>
  )
}
