import { db } from "@/lib/db"

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
  )
}
