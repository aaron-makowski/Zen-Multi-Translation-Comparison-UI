import { db } from "@/lib/db"
import { verseViews, translations } from "@/lib/schema"
import { eq, sql } from "drizzle-orm"

export const revalidate = 60

export default async function StatsPage() {
  const translatorLeaderboard = await db
    .select({
      translator: translations.translator,
      views: sql<number>`count(${verseViews.id})`.as("views"),
    })
    .from(verseViews)
    .leftJoin(translations, eq(verseViews.translationId, translations.id))
    .groupBy(translations.translator)
    .orderBy(sql`count(${verseViews.id}) desc`)

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-6">Contributor Leaderboard</h1>
        <div className="space-y-2">
          {translatorLeaderboard.map((row, idx) => (
            <div key={row.translator ?? "Unknown"} className="flex justify-between border-b py-2">
              <span>
                {idx + 1}. {row.translator ?? "Unknown"}
              </span>
              <span className="font-medium">{row.views} views</span>
            </div>
          ))}
          {translatorLeaderboard.length === 0 && (
            <p className="text-sm text-muted-foreground">No data yet.</p>
          )}
        </div>
      </div>
    </main>
  )
}
