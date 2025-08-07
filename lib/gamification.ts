import { db } from "./db"
import { users } from "./schema"
import { eq } from "drizzle-orm"

export const BADGES = [
  { name: "Novice", karma: 0 },
  { name: "Commentator", karma: 10 },
  { name: "Scholar", karma: 50 },
  { name: "Sage", karma: 150 },
]

const KARMA_VALUES = {
  comment: 5,
  highlight: 2,
} as const

type ActivityType = keyof typeof KARMA_VALUES

export function getBadge(karma: number) {
  let current = BADGES[0]
  for (const badge of BADGES) {
    if (karma >= badge.karma) {
      current = badge
    }
  }
  return current
}

export function getNextBadge(karma: number) {
  return BADGES.find((b) => b.karma > karma)
}

export function badgeProgress(karma: number) {
  const current = getBadge(karma)
  const next = getNextBadge(karma)
  if (!next) return 100
  return ((karma - current.karma) / (next.karma - current.karma)) * 100
}

function daysBetween(a: Date, b: Date) {
  return Math.floor((a.getTime() - b.getTime()) / 86_400_000)
}

export async function addKarma(userId: string, type: ActivityType) {
  const points = KARMA_VALUES[type]
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) })
  if (!user) return null

  const now = new Date()
  const last = user.lastActive ?? now
  let streak = user.streak
  const diff = daysBetween(now, last)
  if (diff === 1) streak += 1
  else if (diff > 1) streak = 1

  const karma = user.karma + points

  await db
    .update(users)
    .set({ karma, streak, lastActive: now })
    .where(eq(users.id, userId))

  return { karma, streak, badge: getBadge(karma) }
}

