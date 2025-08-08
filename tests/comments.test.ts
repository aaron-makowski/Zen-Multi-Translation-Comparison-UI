import { describe, it, expect } from 'vitest'
import { voteComment, Comment } from '../app/api/comments/route'
import { removeComment } from '../app/api/comments/[id]/delete'

describe('voteComment', () => {
  it('increments vote count', () => {
    const data: Record<string, Comment[]> = {
      verse1: [{ id: 'a', content: 'hi', createdAt: '', votes: 0 }]
    }
    const updated = voteComment(data, 'verse1', 'a', 1)
    expect(updated?.votes).toBe(1)
  })

  it('returns null for missing comment', () => {
    const data: Record<string, Comment[]> = { verse1: [] }
    const updated = voteComment(data, 'verse1', 'missing', 1)
    expect(updated).toBeNull()
  })

  it('removes a comment by id', () => {
    const data: Record<string, Comment[]> = {
      verse1: [{ id: 'a', content: 'hi', createdAt: '', votes: 0 }],
    }
    const removed = removeComment(data, 'a')
    expect(removed).toBe(true)
    expect(data.verse1).toBeUndefined()
  })

  it('returns false when comment to remove is missing', () => {
    const data: Record<string, Comment[]> = { verse1: [] }
    const removed = removeComment(data, 'missing')
    expect(removed).toBe(false)
  })
})
