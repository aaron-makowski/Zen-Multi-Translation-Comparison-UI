import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { Progress } from '@/components/ui/progress'
import { getBadge, getNextBadge, progressToNextBadge, calculateStreak } from '@/lib/gamification'
import { promises as fs } from 'fs'
import path from 'path'

interface StoredComment { userId: string; createdAt: string }

export default async function UserProfile({ params }: { params: { userId: string } }) {
  const user = await db.query.users.findFirst({
    where: (usersTable, { eq }) => eq(usersTable.id, params.userId),
  })
  if (!user) notFound()

  let commentData: Record<string, StoredComment[]> = {}
  try {
    const file = await fs.readFile(path.join(process.cwd(), 'data', 'comments.json'), 'utf8')
    commentData = JSON.parse(file || '{}')
  } catch {}

  const dates = Object.values(commentData)
    .flat()
    .filter((c) => c.userId === user.id)
    .map((c) => new Date(c.createdAt))

  const streak = calculateStreak(dates)
  const badge = getBadge(user.karma)
  const nextBadge = getNextBadge(user.karma)
  const progress = progressToNextBadge(user.karma)

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{user.username}</h1>
      <p className="mb-2">Karma: {user.karma}</p>
      <p className="mb-2">Badge: {badge}</p>
      {nextBadge && (
        <div className="mb-4">
          <Progress value={progress} />
          <p className="text-sm mt-1">
            {user.karma} / {nextBadge.threshold} to {nextBadge.name}
          </p>
        </div>
      )}
      <p>Current streak: {streak} day{streak === 1 ? '' : 's'}</p>
    </div>
  )
}
