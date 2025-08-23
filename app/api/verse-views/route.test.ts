import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST, GET } from './route'

// In-memory store to simulate verse_views table
const verseViewsData: any[] = []

// Mock the database module used in the route
vi.mock('@/lib/db', () => ({
  db: {
    insert: () => ({
      values: async (record: any) => {
        verseViewsData.push(record)
      }
    }),
    select: () => ({
      from: () => {
        const promise: any = Promise.resolve(verseViewsData)
        promise.where = async (cond: any) =>
          verseViewsData.filter((row) => row.verseId === cond.value)
        return promise
      }
    })
  }
}))

// Mock schema to satisfy module resolution
vi.mock('@/lib/schema', () => ({ verseViews: {} }))

// Simplified eq helper to return value for filtering
vi.mock('drizzle-orm', () => ({
  eq: (_col: any, value: any) => ({ value })
}))

beforeEach(() => {
  verseViewsData.length = 0
})

describe('verse-views API', () => {
  it('POST inserts verse view with translation and user', async () => {
    const res = await POST(
      new Request('http://test/api/verse-views', {
        method: 'POST',
        body: JSON.stringify({
          verseId: 'v1',
          translationId: 't1',
          userId: 'u1',
          eventType: 'view'
        })
      })
    )
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.id).toBeDefined()
    expect(verseViewsData).toHaveLength(1)
    expect(verseViewsData[0]).toMatchObject({
      id: json.id,
      verseId: 'v1',
      translationId: 't1',
      userId: 'u1',
      eventType: 'view'
    })
  })

  it('POST inserts verse view without user', async () => {
    const res = await POST(
      new Request('http://test/api/verse-views', {
        method: 'POST',
        body: JSON.stringify({
          verseId: 'v1',
          translationId: 't2',
          eventType: 'select'
        })
      })
    )
    const json = await res.json()
    expect(json.id).toBeDefined()
    expect(verseViewsData[0]).toMatchObject({
      verseId: 'v1',
      translationId: 't2',
      userId: undefined,
      eventType: 'select'
    })
  })

  it('POST missing fields returns 400', async () => {
    const res = await POST(
      new Request('http://test/api/verse-views', {
        method: 'POST',
        body: JSON.stringify({ translationId: 't1', eventType: 'view' })
      })
    )
    expect(res.status).toBe(400)
  })

  it('GET returns all records with correct shape', async () => {
    verseViewsData.push(
      {
        id: '1',
        verseId: 'v1',
        translationId: 't1',
        userId: 'u1',
        eventType: 'view'
      },
      {
        id: '2',
        verseId: 'v2',
        translationId: 't2',
        userId: 'u2',
        eventType: 'select'
      }
    )
    const res = await GET(new Request('http://test/api/verse-views'))
    const json = await res.json()
    expect(json).toHaveLength(2)
    expect(json[0]).toHaveProperty('id')
    expect(json[0]).toHaveProperty('verseId')
    expect(json[0]).toHaveProperty('translationId')
    expect(json[0]).toHaveProperty('userId')
    expect(json[0]).toHaveProperty('eventType')
  })

  it('GET filters by verseId', async () => {
    verseViewsData.push(
      {
        id: '1',
        verseId: 'v1',
        translationId: 't1',
        userId: 'u1',
        eventType: 'view'
      },
      {
        id: '2',
        verseId: 'v2',
        translationId: 't2',
        userId: 'u2',
        eventType: 'view'
      }
    )
    const res = await GET(
      new Request('http://test/api/verse-views?verseId=v1')
    )
    const json = await res.json()
    expect(json).toHaveLength(1)
    expect(json[0].verseId).toBe('v1')
  })
})

