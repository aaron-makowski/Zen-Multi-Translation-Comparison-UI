<<<<<<< HEAD
import { users } from "./schema"
import { eq, sql } from "drizzle-orm"

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

export async function addKarma(
  userId: string | undefined,
  type: "comment" | "highlight",
  points = 1,
) {
  if (!userId) {
    throw new Error("userId is required")
  }
  const { db } = await import("./db")
  const update =
    type === "comment"
      ? { commentKarma: sql`${users.commentKarma} + ${points}` }
      : { highlightKarma: sql`${users.highlightKarma} + ${points}` }
  const res = await db
    .update(users)
    .set(update)
    .where(eq(users.id, userId))
    .returning({ id: users.id })
  if (res.length === 0) {
    throw new Error(`User with id ${userId} not found`)
  }
  return res[0]
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
  return ((value - prevRequirement) / (next.requirement - prevRequirement)) * 100
}

export function calculateStreak(dates: Date[]): number {
  if (!dates.length) return 0
  const sorted = dates
    .map((d) => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime())
  let streak = 1
  for (let i = 1; i < sorted.length; i++) {
    const diff =
      (sorted[i - 1].setHours(0, 0, 0, 0) - sorted[i].setHours(0, 0, 0, 0)) /
      86400000
    if (diff === 1) streak++
    else if (diff > 1) break
  }
  return streak
}
=======
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

>>>>>>> origin/codex/track-karma-points-for-comments
