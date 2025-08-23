import { describe, expect, it, vi } from 'vitest'

vi.mock('../lib/db', () => ({
  db: {
    update: () => ({
      set: () => ({
        where: () => ({
          returning: () => Promise.resolve([]),
        }),
      }),
    }),
  },
}))

import {
  calculateStreak,
  getBadges,
  commentBadges,
  addKarma,
} from '../lib/gamification'

describe('gamification helpers', () => {
  it('calculates streaks correctly', () => {
    const today = new Date()
    const yesterday = new Date(Date.now() - 86400000)
    const dates = [today, yesterday]
    expect(calculateStreak(dates)).toBe(2)
  })

  it('awards comment badges based on karma', () => {
    const badges = getBadges({ commentKarma: 10, highlightKarma: 0 })
    expect(badges.comments).toContain(commentBadges[1].name)
  })
})

describe('addKarma', () => {
  it('throws for invalid user ID', async () => {
    await expect(addKarma('invalid', 'comment')).rejects.toThrow()
  })
})
