import { describe, it, expect, vi, beforeEach } from 'vitest'

const data = [
  { id: 'n1', userId: 'u1', type: 'reply', content: 'hi', read: false }
]

let currentUserId: string | undefined
let currentId: string | undefined

vi.mock('../lib/schema', () => ({
  notifications: {}
}))

vi.mock('drizzle-orm', () => ({
  eq: () => ({})
}))

vi.mock('../lib/db', () => ({
  db: {
    select: () => ({
      from: () => ({
        where: async () => data.filter(r => r.userId === currentUserId)
      })
    }),
    update: () => ({
      set: (fields: any) => ({
        where: async () => {
          const idx = data.findIndex(r => r.id === currentId)
          if (idx !== -1) {
            data[idx] = { ...data[idx], ...fields }
          }
        }
      })
    })
  }
}))

import { GET, PATCH } from '../app/api/notifications/route'

beforeEach(() => {
  data[0].read = false
  currentUserId = undefined
  currentId = undefined
})

describe('notifications API', () => {
  it('GET returns notifications for a user', async () => {
    currentUserId = 'u1'
    const res = await GET(new Request('http://test/notifications?userId=u1'))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toEqual(data)
  })

  it('GET returns 400 if missing userId', async () => {
    const res = await GET(new Request('http://test/notifications'))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json).toEqual({ error: 'Missing userId' })
  })

  it('PATCH marks notification as read', async () => {
    currentId = 'n1'
    const res = await PATCH(
      new Request('http://test/notifications', {
        method: 'PATCH',
        body: JSON.stringify({ id: 'n1' }),
        headers: { 'Content-Type': 'application/json' }
      })
    )
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toEqual({ success: true })
    expect(data[0].read).toBe(true)
  })

  it('PATCH returns 400 if missing id', async () => {
    const res = await PATCH(
      new Request('http://test/notifications', {
        method: 'PATCH',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' }
      })
    )
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json).toEqual({ error: 'Missing id' })
  })
})
