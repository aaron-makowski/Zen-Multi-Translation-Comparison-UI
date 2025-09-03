import { db } from "./db"
import { users } from "./schema"
import { eq } from "drizzle-orm"

export interface Badge {
  name: string
  requirement: number
}

export const commentBadges: Badge[] = [
  { name: "First Comment", requirement: 1 },
  { name: "Conversationalist", requirement: 10 },
  { name: "Commentator", requirement: 50 },
]

export const highlightBadges: Badge[] = [
  { name: "First Highlight", requirement: 1 },
  { name: "Highlighter", requirement: 10 },
  { name: "Illuminator", requirement: 50 },
]

export const karmaBadges: Badge[] = [
  { name: "Novice", requirement: 0 },
  { name: "Commentator", requirement: 10 },
  { name: "Scholar", requirement: 50 },
  { name: "Sage", requirement: 150 },
]

const KARMA_VALUES = {
  comment: 5,
  highlight: 2,
} as const

type ActivityType = keyof typeof KARMA_VALUES

function daysBetween(a: Date, b: Date): number {
  return Math.floor((a.getTime() - b.getTime()) / 86_400_000)
}

export function getKarmaBadge(karma: number): Badge {
  let current = karmaBadges[0]
  for (const badge of karmaBadges) {
    if (karma >= badge.requirement) {
      current = badge
    }
  }
  return current
}

export function getNextKarmaBadge(karma: number): Badge | undefined {
  return karmaBadges.find((b) => b.requirement > karma)
}

export function badgeProgress(karma: number): number {
  const current = getKarmaBadge(karma)
  const next = getNextKarmaBadge(karma)
  if (!next) return 100
  return (
    ((karma - current.requirement) /
      (next.requirement - current.requirement)) *
    100
  )
}

export async function addKarma(userId: string, type: ActivityType) {
  if (!userId) throw new Error("userId is required")
  const points = KARMA_VALUES[type]
  type UserStats = {
    karma: number
    streak: number
    lastActive: Date | null
  }
  const user = (await db.query.users.findFirst({
    where: eq(users.id, userId),
  })) as (UserStats | null)
  if (!user) {
    throw new Error(`User with id ${userId} not found`)
  }

  const now = new Date()
  const last = user.lastActive ?? now
  let streak = user.streak ?? 1
  const diff = daysBetween(now, last)
  if (diff === 1) streak += 1
  else if (diff > 1) streak = 1

  const karma = (user.karma ?? 0) + points

  await db
    .update(users)
    .set({ karma, streak, lastActive: now })
    .where(eq(users.id, userId))

  return { karma, streak, badge: getKarmaBadge(karma) }
}

export function getBadges(user: {
  commentKarma: number
  highlightKarma: number
}) {
  return {
    comments: commentBadges
      .filter((b) => user.commentKarma >= b.requirement)
      .map((b) => b.name),
    highlights: highlightBadges
      .filter((b) => user.highlightKarma >= b.requirement)
      .map((b) => b.name),
  }
}

export function progressToNextBadge(value: number, badges: Badge[]) {
  const next = badges.find((b) => value < b.requirement)
  if (!next) return 100
  const index = badges.indexOf(next)
  const prevRequirement = index > 0 ? badges[index - 1].requirement : 0
  return (
    ((value - prevRequirement) / (next.requirement - prevRequirement)) * 100
  )
}

export function calculateStreak(dates: Date[]): number {
  if (!dates.length) return 0
  const sorted = dates
    .map((d) => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime())
  let streak = 1
  for (let i = 1; i < sorted.length; i++) {
    const diff =
      (sorted[i - 1].setHours(0, 0, 0, 0) -
        sorted[i].setHours(0, 0, 0, 0)) /
      86400000
    if (diff === 1) streak++
    else if (diff > 1) break
  }
  return streak
}

