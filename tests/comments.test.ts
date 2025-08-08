import { describe, it, expect } from 'vitest'
import { voteComment, Comment } from '../app/api/comments/route'

describe('voteComment', () => {
  it('increments vote count', () => {
    const data: Record<string, Comment[]> = {
      verse1: [
        { id: 'a', content: 'hi', createdAt: '', updatedAt: '', votes: 0 }
      ]
    }
    const updated = voteComment(data, 'verse1', 'a', 1)
    expect(updated?.votes).toBe(1)
  })

  it('returns null for missing comment', () => {
    const data: Record<string, Comment[]> = { verse1: [] }
    const updated = voteComment(data, 'verse1', 'missing', 1)
    expect(updated).toBeNull()
  })
})
