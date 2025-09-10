import { describe, expect, it, vi, beforeEach } from 'vitest'

const { findFirstMock, updateMock, setMock, whereMock } = vi.hoisted(() => {
  const whereMock = vi.fn(() => Promise.resolve())
  const setMock = vi.fn(() => ({ where: whereMock }))
  const updateMock = vi.fn(() => ({ set: setMock }))
  const findFirstMock = vi.fn()
  return { findFirstMock, updateMock, setMock, whereMock }
})

vi.mock('../lib/db', () => ({
  db: {
    query: { users: { findFirst: findFirstMock } },
    update: updateMock,
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
    vi.clearAllMocks()
  })

  it('updates comment karma and persists changes', async () => {
    const user = {
      id: '1',
      karma: 0,
      commentKarma: 0,
      highlightKarma: 0,
      streak: 1,
      lastActive: new Date(Date.now() - 86_400_000),
    }
    findFirstMock.mockResolvedValueOnce(user)

    const result = await addKarma('1', 'comment')

    expect(result.karma).toBe(5)
    expect(result.commentKarma).toBe(5)
    expect(result.highlightKarma).toBe(0)
    expect(result.streak).toBe(2)
    expect(result.badge.name).toBe('Novice')

    expect(updateMock).toHaveBeenCalledOnce()
    expect(setMock).toHaveBeenCalledWith(
      expect.objectContaining({
        karma: 5,
        commentKarma: 5,
        highlightKarma: 0,
        streak: 2,
        lastActive: expect.any(Date),
      })
    )
  })

  it('updates highlight karma and persists changes', async () => {
    const user = {
      id: '1',
      karma: 5,
      commentKarma: 5,
      highlightKarma: 0,
      streak: 1,
      lastActive: new Date(Date.now() - 86_400_000),
    }
    findFirstMock.mockResolvedValueOnce(user)

    const result = await addKarma('1', 'highlight')

    expect(result.karma).toBe(7)
    expect(result.commentKarma).toBe(5)
    expect(result.highlightKarma).toBe(2)
    expect(result.streak).toBe(2)
    expect(result.badge.name).toBe('Novice')

    expect(updateMock).toHaveBeenCalledOnce()
    expect(setMock).toHaveBeenCalledWith(
      expect.objectContaining({
        karma: 7,
        commentKarma: 5,
        highlightKarma: 2,
        streak: 2,
        lastActive: expect.any(Date),
      })
    )
  })

  it('throws for invalid user ID', async () => {
    findFirstMock.mockResolvedValueOnce(null)
    await expect(addKarma('invalid', 'comment')).rejects.toThrow()
  })
})
