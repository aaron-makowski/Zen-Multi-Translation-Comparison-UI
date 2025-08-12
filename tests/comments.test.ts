import { describe, it, expect, beforeEach } from 'vitest'
import { POST, GET } from '../app/api/comments/route'
import { PATCH as MODERATE_PATCH, DELETE as MODERATE_DELETE } from '../app/api/comments/[id]/moderate/route'
import { promises as fs } from 'fs'
import path from 'path'

const COMMENTS_FILE = path.join(process.cwd(), 'data', 'comments.json')

async function resetData() {
  await fs.rm(COMMENTS_FILE, { force: true })
}

beforeEach(async () => {
  await resetData()
})

describe('comments API', () => {
  it('creates and retrieves root and nested comments', async () => {
    const rootRes = await POST(
      new Request('http://localhost/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verseId: 'v1', content: 'Hello **root**' })
      })
    )
    expect(rootRes.status).toBe(200)
    const root = await rootRes.json()
    expect(root.flagged).toBe(false)
    expect(root.removed).toBe(false)
    expect(root.parentId).toBeUndefined()
    expect(root.content).toContain('<strong>root</strong>')

    const replyRes = await POST(
      new Request('http://localhost/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verseId: 'v1', content: 'child', parentId: root.id })
      })
    )
    const reply = await replyRes.json()
    expect(reply.parentId).toBe(root.id)

    const listRes = await GET(
      new Request('http://localhost/api/comments?verseId=v1')
    )
    const list = await listRes.json()
    expect(list).toHaveLength(2)

    const nestedRes = await GET(
      new Request(`http://localhost/api/comments?verseId=v1&parentId=${root.id}`)
    )
    const nested = await nestedRes.json()
    expect(nested).toHaveLength(1)
    expect(nested[0].id).toBe(reply.id)
  })

  it('sanitizes markdown input', async () => {
    const res = await POST(
      new Request('http://localhost/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verseId: 'v1',
          content: 'Hi <script>alert(1)</script> there'
        })
      })
    )
    const comment = await res.json()
    expect(comment.content).not.toContain('<script>')
  })

  it('flags and removes comments via moderation endpoints', async () => {
    const createRes = await POST(
      new Request('http://localhost/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verseId: 'v1', content: 'to moderate' })
      })
    )
    const created = await createRes.json()

    const flagRes = await MODERATE_PATCH(
      new Request(`http://localhost/api/comments/${created.id}/moderate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'flag' })
      }),
      { params: { id: created.id } }
    )
    expect(flagRes.status).toBe(200)
    const flagged = await flagRes.json()
    expect(flagged.flagged).toBe(true)

    const deleteRes = await MODERATE_DELETE(
      new Request(`http://localhost/api/comments/${created.id}/moderate`, {
        method: 'DELETE'
      }),
      { params: { id: created.id } }
    )
    expect(deleteRes.status).toBe(200)

    const afterRes = await GET(
      new Request('http://localhost/api/comments?verseId=v1')
    )
    const list = await afterRes.json()
    const stored = list.find((c: any) => c.id === created.id)
    expect(stored.removed).toBe(true)
    expect(stored.content).toBe('[removed]')
  })

  it('returns errors for invalid moderation requests', async () => {
    const invalidAction = await MODERATE_PATCH(
      new Request('http://localhost/api/comments/x/moderate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ban' })
      }),
      { params: { id: 'x' } }
    )
    expect(invalidAction.status).toBe(400)

    const notFound = await MODERATE_PATCH(
      new Request('http://localhost/api/comments/x/moderate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'flag' })
      }),
      { params: { id: 'x' } }
    )
    expect(notFound.status).toBe(404)

    const deleteMissing = await MODERATE_DELETE(
      new Request('http://localhost/api/comments/x/moderate', {
        method: 'DELETE'
      }),
      { params: { id: 'x' } }
    )
    expect(deleteMissing.status).toBe(404)
  })
})
