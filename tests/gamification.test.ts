import { describe, expect, it, vi, beforeEach } from 'vitest'

const mocks = vi.hoisted(() => {
  const where = vi.fn().mockResolvedValue(undefined)
  const set = vi.fn(() => ({ where }))
  const update = vi.fn(() => ({ set }))
  const findFirst = vi.fn()
  return { where, set, update, findFirst }
})

vi.mock('../lib/db', () => ({
  db: {
    update: mocks.update,
    query: { users: { findFirst: mocks.findFirst } },
  },
}))

vi.mock('../lib/schema', () => ({ users: {} }))

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
  beforeEach(() => {
    mocks.findFirst.mockReset()
    mocks.update.mockClear()
    mocks.set.mockClear()
    mocks.where.mockClear()
  })

  it('throws for invalid user ID', async () => {
    mocks.findFirst.mockResolvedValue(null)
    await expect(addKarma('invalid', 'comment')).rejects.toThrow()
  })

  it('updates karma and streak and persists', async () => {
    const mockUser = {
      id: 'u1',
      karma: 10,
      commentKarma: 4,
      highlightKarma: 1,
      streak: 2,
      lastActive: new Date(Date.now() - 86400000),
    }
    mocks.findFirst.mockResolvedValue(mockUser)

    const result = await addKarma('u1', 'comment')

    expect(result.karma).toBe(15)
    expect(result.commentKarma).toBe(9)
    expect(result.highlightKarma).toBe(1)
    expect(result.streak).toBe(3)
    expect(result.badge.name).toBe('Commentator')

    expect(mocks.update).toHaveBeenCalledTimes(1)
    expect(mocks.set).toHaveBeenCalledWith(
      expect.objectContaining({
        karma: 15,
        commentKarma: 9,
        highlightKarma: 1,
        streak: 3,
        lastActive: expect.any(Date),
      })
    )
  })
})
