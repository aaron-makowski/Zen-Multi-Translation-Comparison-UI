import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { getBadge, getNextBadge, badgeProgress } from "@/lib/gamification"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default async function UserProfile({
  params,
}: {
  params: { userId: string }
}) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, params.userId),
  })

  if (!user) {
    notFound()
  }

  const badge = getBadge(user.karma)
  const next = getNextBadge(user.karma)
  const progress = badgeProgress(user.karma)

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-4">{user.username}</h1>
        <Card className="p-6">
          <p className="font-medium mb-2">Karma: {user.karma}</p>
          <p className="font-medium mb-2">Badge: {badge.name}</p>
          <p className="text-sm text-muted-foreground mb-4">
            Streak: {user.streak} days
          </p>
          {next && (
            <div>
              <Progress value={progress} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                {user.karma} / {next.karma} karma to {next.name}
              </p>
            </div>
          )}
        </Card>
      </div>
    </main>
  )
}

