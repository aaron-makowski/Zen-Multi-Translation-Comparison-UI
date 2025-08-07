import { users } from './schema'
import { eq, sql } from 'drizzle-orm'

export const KARMA_VALUES = {
  comment: 1,
  highlight: 1,
} as const

type KarmaAction = keyof typeof KARMA_VALUES

export async function addKarmaPoints(userId: string, action: KarmaAction) {
  const { db } = await import('./db')
  const points = KARMA_VALUES[action]
  await db
    .update(users)
    .set({ karma: sql`${users.karma} + ${points}` })
    .where(eq(users.id, userId))
}

export const BADGES = [
  { name: 'Novice', threshold: 0 },
  { name: 'Contributor', threshold: 10 },
  { name: 'Scholar', threshold: 50 },
  { name: 'Master', threshold: 100 },
]

export function getBadge(karma: number) {
  let current = BADGES[0]
  for (const b of BADGES) {
    if (karma >= b.threshold) current = b
    else break
  }
  return current.name
}

export function getNextBadge(karma: number) {
  for (const b of BADGES) {
    if (karma < b.threshold) return b
  }
  return null
}

export function progressToNextBadge(karma: number) {
  const next = getNextBadge(karma)
  if (!next) return 100
  const currentIndex = BADGES.findIndex((b) => b.threshold === next.threshold) - 1
  const current = BADGES[Math.max(currentIndex, 0)]
  const range = next.threshold - current.threshold
  return ((karma - current.threshold) / range) * 100
}

export function calculateStreak(dates: Date[]) {
  const uniqueDays = Array.from(
    new Set(dates.map((d) => d.toISOString().slice(0, 10)))
  )
    .map((d) => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime())

  let streak = 0
  const today = new Date()
  for (const day of uniqueDays) {
    const expected = new Date()
    expected.setDate(today.getDate() - streak)
    if (day.toDateString() === expected.toDateString()) streak++
    else if (day < expected) break
  }
  return streak
}
