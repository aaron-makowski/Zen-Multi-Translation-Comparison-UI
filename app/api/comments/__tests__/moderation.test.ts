import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import fs from 'fs/promises'
import path from 'path'
import { DELETE as deleteComment } from '../[id]/delete'
import { POST as flagComment, DELETE as unflagComment } from '../[id]/flags'
import { auditLogs, flags } from '@/lib/schema'
import { adminMiddleware } from '@/lib/auth'
import { NextRequest } from 'next/server'

const DATA_FILE = path.join(process.cwd(), 'data', 'comments.json')

const inserts: any[] = []
const deletes: any[] = []

vi.mock('@/lib/db', () => {
  return {
    db: {
      insert: vi.fn((table: any) => ({
        values: vi.fn(async (val: any) => {
          inserts.push({ table, val })
        }),
      })),
      delete: vi.fn((table: any) => ({
        where: vi.fn(async (cond: any) => {
          deletes.push({ table, cond })
        }),
      })),
    },
  }
})

describe('comment moderation API', () => {
  beforeEach(async () => {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
    await fs.writeFile(
      DATA_FILE,
      JSON.stringify({ verse1: [{ id: 'c1', content: 'hi', createdAt: '', votes: 0 }] }),
    )
    inserts.length = 0
    deletes.length = 0
  })

  afterEach(async () => {
    try {
      await fs.unlink(DATA_FILE)
    } catch {}
  })

  it('deletes a comment and records audit log', async () => {
    const req = new Request('http://example.com', {
      headers: { 'x-user-id': 'admin123', 'x-user-role': 'admin' },
    })
    const res = await deleteComment(req, { params: { id: 'c1' } })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ success: true })

    const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'))
    expect(data.verse1).toHaveLength(0)

    const log = inserts.find((i) => i.table === auditLogs)
    expect(log).toBeTruthy()
    expect(log.val).toMatchObject({
      action: 'delete_comment',
      targetType: 'comment',
      targetId: 'c1',
      userId: 'admin123',
    })
  })

  it('returns 404 when deleting missing comment', async () => {
    const req = new Request('http://example.com', {
      headers: { 'x-user-id': 'admin123', 'x-user-role': 'admin' },
    })
    const res = await deleteComment(req, { params: { id: 'missing' } })
    expect(res.status).toBe(404)
    const log = inserts.find((i) => i.table === auditLogs)
    expect(log).toBeUndefined()
  })

  it('flags and unflags a comment with audit logging', async () => {
    const postReq = new Request('http://example.com', {
      method: 'POST',
      body: JSON.stringify({ reason: 'spam', userId: 'user1' }),
    })
    const flagRes = await flagComment(postReq, { params: { id: 'c1' } })
    expect(flagRes.status).toBe(200)
    const flagBody = await flagRes.json()
    expect(flagBody.id).toBeDefined()

    const flagInsert = inserts.find((i) => i.table === flags)
    expect(flagInsert.val).toMatchObject({
      commentId: 'c1',
      userId: 'user1',
      reason: 'spam',
    })

    const flagLog = inserts.find(
      (i) => i.table === auditLogs && i.val.action === 'flag_comment',
    )
    expect(flagLog).toBeTruthy()
    expect(flagLog.val).toMatchObject({ targetId: 'c1', userId: 'user1' })

    const delReq = new Request('http://example.com', {
      method: 'DELETE',
      body: JSON.stringify({ userId: 'admin123' }),
    })
    const unflagRes = await unflagComment(delReq, { params: { id: 'c1' } })
    expect(unflagRes.status).toBe(200)
    const unflagBody = await unflagRes.json()
    expect(unflagBody).toEqual({ success: true })

    const deleteCall = deletes.find((d) => d.table === flags)
    expect(deleteCall).toBeTruthy()

    const unflagLog = inserts.find(
      (i) => i.table === auditLogs && i.val.action === 'unflag_comment',
    )
    expect(unflagLog.val).toMatchObject({ targetId: 'c1', userId: 'admin123' })
  })
})

describe('admin middleware', () => {
  it('returns 403 for non-admin', () => {
    const req = new NextRequest('http://example.com', {
      headers: { 'x-user-role': 'user' },
    })
    const res = adminMiddleware(req)
    expect(res.status).toBe(403)
  })

  it('allows admin', () => {
    const req = new NextRequest('http://example.com', {
      headers: { 'x-user-role': 'admin' },
    })
    const res = adminMiddleware(req)
    expect(res.status).toBe(200)
  })
})

