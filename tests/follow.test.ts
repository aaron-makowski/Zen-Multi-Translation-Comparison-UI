import { describe, it, expect, vi, beforeEach } from 'vitest'

const follows = new Set<string>()

vi.mock('@/lib/db', () => {
  return {
    db: {
      insert: () => ({
        values: ({ followerId, followingId }: any) => ({
          onConflictDoNothing: async () => {
            follows.add(`${followerId}:${followingId}`)
          },
        }),
      }),
      delete: () => ({
        where: async () => {},
      }),
    },
  }
})

import { POST, DELETE } from '../app/api/users/[userId]/follow'

const userId = 'user2'
const followerId = 'user1'

beforeEach(() => {
  follows.clear()
})

describe('follow API', () => {
  it('follows a user', async () => {
    const res = await POST(
      new Request('http://test', {
        method: 'POST',
        body: JSON.stringify({ followerId }),
      }),
      { params: { userId } }
    )
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true })
  })

  it('unfollows a user', async () => {
    const res = await DELETE(
      new Request('http://test', {
        method: 'DELETE',
        body: JSON.stringify({ followerId }),
      }),
      { params: { userId } }
    )
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true })
  })

  it('requires followerId', async () => {
    const res = await POST(
      new Request('http://test', {
        method: 'POST',
        body: JSON.stringify({}),
      }),
      { params: { userId } }
    )
    expect(res.status).toBe(400)
  })

  it('is idempotent for follow', async () => {
    await POST(
      new Request('http://test', {
        method: 'POST',
        body: JSON.stringify({ followerId }),
      }),
      { params: { userId } }
    )
    const res = await POST(
      new Request('http://test', {
        method: 'POST',
        body: JSON.stringify({ followerId }),
      }),
      { params: { userId } }
    )
    expect(res.status).toBe(200)
    expect(follows.size).toBe(1)
  })

  it('is idempotent for unfollow', async () => {
    await DELETE(
      new Request('http://test', {
        method: 'DELETE',
        body: JSON.stringify({ followerId }),
      }),
      { params: { userId } }
    )
    const res = await DELETE(
      new Request('http://test', {
        method: 'DELETE',
        body: JSON.stringify({ followerId }),
      }),
      { params: { userId } }
    )
    expect(res.status).toBe(200)
  })
})
