import { describe, it, expect, beforeEach, vi } from 'vitest'

let GET: any, POST: any, DELETE_: any
let store: any[]

beforeEach(async () => {
  store = []
  await vi.resetModules()

  vi.doMock('@/lib/schema', () => ({
    bookmarks: { userId: 'userId', verseId: 'verseId' }
  }))

  vi.doMock('drizzle-orm', () => ({
    eq: (field: string, value: any) => ({ field, value }),
    and: (a: any, b: any) => ({ cond1: a, cond2: b })
  }))

  vi.doMock('@/lib/db', () => ({
    db: {
      select: () => ({
        from: () => ({
          where: ({ field, value }: any) => Promise.resolve(store.filter((b) => b[field] === value))
        })
      }),
      insert: () => ({
        values: (val: any) => ({
          onConflictDoNothing: () => ({
            returning: () => {
              const exists = store.some((b) => b.userId === val.userId && b.verseId === val.verseId)
              if (!exists) {
                store.push(val)
                return Promise.resolve([val])
              }
              return Promise.resolve([null])
            }
          })
        })
      }),
      delete: () => ({
        where: ({ cond1, cond2 }: any) => {
          const userId = cond1.value
          const verseId = cond2.value
          const index = store.findIndex((b) => b.userId === userId && b.verseId === verseId)
          if (index !== -1) store.splice(index, 1)
          return Promise.resolve()
        }
      })
    }
  }))

  const mod = await import('../../app/api/bookmarks/route')
  GET = mod.GET
  POST = mod.POST
  DELETE_ = mod.DELETE
})

describe('bookmarks API', () => {
  it('GET requires userId', async () => {
    const res = await GET(new Request('http://test/api/bookmarks'))
    expect(res.status).toBe(400)
  })

  it('POST requires fields', async () => {
    const res = await POST(
      new Request('http://test/api/bookmarks', {
        method: 'POST',
        body: JSON.stringify({ userId: 'u1' }),
        headers: { 'Content-Type': 'application/json' }
      })
    )
    expect(res.status).toBe(400)
  })

  it('DELETE requires fields', async () => {
    const res = await DELETE_(
      new Request('http://test/api/bookmarks', {
        method: 'DELETE',
        body: JSON.stringify({ userId: 'u1' }),
        headers: { 'Content-Type': 'application/json' }
      })
    )
    expect(res.status).toBe(400)
  })

  it('posting twice does not duplicate', async () => {
    const makeReq = () =>
      new Request('http://test/api/bookmarks', {
        method: 'POST',
        body: JSON.stringify({ userId: 'u1', verseId: 'v1' }),
        headers: { 'Content-Type': 'application/json' }
      })
    await POST(makeReq())
    await POST(makeReq())
    const res = await GET(new Request('http://test/api/bookmarks?userId=u1'))
    const list = await res.json()
    expect(list).toHaveLength(1)
  })

  it('lists bookmarks for a user', async () => {
    await POST(
      new Request('http://test/api/bookmarks', {
        method: 'POST',
        body: JSON.stringify({ userId: 'u1', verseId: 'v1' }),
        headers: { 'Content-Type': 'application/json' }
      })
    )
    await POST(
      new Request('http://test/api/bookmarks', {
        method: 'POST',
        body: JSON.stringify({ userId: 'u2', verseId: 'v2' }),
        headers: { 'Content-Type': 'application/json' }
      })
    )
    const res = await GET(new Request('http://test/api/bookmarks?userId=u1'))
    const list = await res.json()
    expect(list).toHaveLength(1)
    expect(list[0].userId).toBe('u1')
  })

  it('deleting a bookmark removes it', async () => {
    await POST(
      new Request('http://test/api/bookmarks', {
        method: 'POST',
        body: JSON.stringify({ userId: 'u1', verseId: 'v1' }),
        headers: { 'Content-Type': 'application/json' }
      })
    )
    await DELETE_(
      new Request('http://test/api/bookmarks', {
        method: 'DELETE',
        body: JSON.stringify({ userId: 'u1', verseId: 'v1' }),
        headers: { 'Content-Type': 'application/json' }
      })
    )
    const res = await GET(new Request('http://test/api/bookmarks?userId=u1'))
    const list = await res.json()
    expect(list).toHaveLength(0)
  })
})

