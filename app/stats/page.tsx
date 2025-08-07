import { db } from "@/lib/db"
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
  )
}
