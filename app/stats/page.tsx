import { db } from "@/lib/db"
<<<<<<< HEAD

export const revalidate = 60

export default async function StatsPage() {
  const users = await db.query.users.findMany({
    with: {
      notes: true,
      comments: true,
    },
  })

  const leaderboard = users
    .map((u) => ({
      username: u.username,
      contributions: u.notes.length + u.comments.length,
    }))
    .sort((a, b) => b.contributions - a.contributions)
    .slice(0, 10)

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6">Contributor Leaderboard</h1>
        <ol className="space-y-2">
          {leaderboard.map((u, i) => (
            <li key={u.username} className="flex justify-between border-b pb-2">
              <span className="font-medium">{i + 1}. {u.username}</span>
              <span className="text-sm text-gray-500">{u.contributions} contributions</span>
            </li>
          ))}
        </ol>
      </div>
    </main>
=======
import { sql } from "drizzle-orm"

async function getLeaders() {
  const noteLeaders = await db.execute(
    sql`SELECT u.username, COUNT(n.id) AS count
        FROM notes n
        JOIN users u ON n.user_id = u.id
        GROUP BY u.username
        ORDER BY count DESC
        LIMIT 5`
  )

  const viewLeaders = await db.execute(
    sql`SELECT COALESCE(u.username, 'Anonymous') AS username, COUNT(v.id) AS count
        FROM verse_views v
        LEFT JOIN users u ON v.user_id = u.id
        GROUP BY u.username
        ORDER BY count DESC
        LIMIT 5`
  )

  return { noteLeaders, viewLeaders }
}

export default async function StatsPage() {
  const { noteLeaders, viewLeaders } = await getLeaders()
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Contributor Leaderboards</h1>
      <section>
        <h2 className="text-xl font-semibold">Top Note Authors</h2>
        <ul>
          {noteLeaders.rows.map((row: any) => (
            <li key={row.username}>{row.username}: {row.count}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold">Top Verse Viewers</h2>
        <ul>
          {viewLeaders.rows.map((row: any) => (
            <li key={row.username}>{row.username}: {row.count}</li>
          ))}
        </ul>
      </section>
    </div>
>>>>>>> origin/codex/track-verse-views-and-translations
  )
}
