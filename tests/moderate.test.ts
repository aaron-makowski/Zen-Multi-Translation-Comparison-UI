import { describe, it, expect } from 'vitest'
import { removeWithDescendants, Comment } from '../app/api/comments/[id]/moderate'

describe('removeWithDescendants', () => {
  it('removes nested replies recursively', () => {
    const list: Comment[] = [
      { id: 'a', content: '', createdAt: '', votes: 0 },
      { id: 'b', content: '', createdAt: '', votes: 0, parentId: 'a' },
      { id: 'c', content: '', createdAt: '', votes: 0, parentId: 'b' },
      { id: 'd', content: '', createdAt: '', votes: 0 }
    ]
    const { removed, list: updated } = removeWithDescendants(list, 'a')
    expect(removed?.id).toBe('a')
    const ids = updated.map((c) => c.id)
    expect(ids).toEqual(['d'])
  })
})
