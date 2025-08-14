import { describe, it, expect, vi, beforeEach } from 'vitest'

const mocks = vi.hoisted(() => {
  const valuesMock = vi.fn().mockResolvedValue(undefined)
  const insertMock = vi.fn(() => ({ values: valuesMock }))
  return { valuesMock, insertMock }
})

vi.mock('../../../../../lib/comments', () => ({
  readComments: vi.fn(),
  writeComments: vi.fn(),
  findCommentById: vi.fn(),
}))

vi.mock('../../../../../lib/db', () => ({
  db: { insert: mocks.insertMock },
}))

import { readComments, writeComments, findCommentById } from '../../../../../lib/comments'
import { db } from '../../../../../lib/db'
import { DELETE } from './route'

const comment = {
  id: 'c1',
  content: 'hi',
  createdAt: '',
  votes: 0,
  flags: 0,
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('deleting a comment', () => {
  it('removes comment and logs audit', async () => {
    const data = { verse1: [comment] }
    ;(readComments as any).mockResolvedValue(data)
    ;(findCommentById as any).mockReturnValue({ verseId: 'verse1', index: 0, comment })

    const res = await DELETE(new Request('http://test'), { params: { id: 'c1' } })
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body).toEqual({ success: true })
    expect(data.verse1).toHaveLength(0)
    expect(writeComments).toHaveBeenCalledWith(data)
    expect(db.insert).toHaveBeenCalled()
    expect(mocks.valuesMock).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'delete_comment', entityId: 'c1' })
    )
  })

  it('returns 404 for missing comment', async () => {
    ;(readComments as any).mockResolvedValue({})
    ;(findCommentById as any).mockReturnValue(null)

    const res = await DELETE(new Request('http://test'), { params: { id: 'missing' } })

    expect(res.status).toBe(404)
    expect(db.insert).not.toHaveBeenCalled()
  })
})
