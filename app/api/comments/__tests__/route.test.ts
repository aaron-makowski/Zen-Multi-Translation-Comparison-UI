import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'

let tmpDir: string

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'comments-test-'))
  vi.resetModules()
  vi.spyOn(process, 'cwd').mockReturnValue(tmpDir)
})

afterEach(async () => {
  vi.restoreAllMocks()
  await fs.rm(tmpDir, { recursive: true, force: true })
})

describe('comments API', () => {
  it('creates top-level comment and sanitizes markdown', async () => {
    const { POST, GET } = await import('../route')
    const res = await POST(
      new Request('http://test', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          verseId: 'v1',
          content: '# Title <script>alert(1)</script>'
        })
      })
    )
    expect(res.status).toBe(200)
    const comment = await res.json()
    expect(comment.parentId).toBeUndefined()
    expect(comment.content).toContain('<h1>')
    expect(comment.content).not.toContain('<script>')

    const listRes = await GET(
      new Request('http://test?verseId=v1', { method: 'GET' })
    )
    const list = await listRes.json()
    expect(list.length).toBe(1)
    expect(list[0].content).toBe(comment.content)
  })

  it('creates reply with parentId', async () => {
    const { POST } = await import('../route')
    const res = await POST(
      new Request('http://test', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          verseId: 'v1',
          content: 'reply',
          parentId: 'parent1'
        })
      })
    )
    const comment = await res.json()
    expect(comment.parentId).toBe('parent1')
  })
})

describe('moderation API', () => {
  it('flags a comment', async () => {
    const { POST: create, GET } = await import('../route')
    const { POST: moderate } = await import('../[id]/moderate')
    const createRes = await create(
      new Request('http://test', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ verseId: 'v1', content: 'test' })
      })
    )
    const comment = await createRes.json()
    const modRes = await moderate(
      new Request('http://test', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ verseId: 'v1', action: 'flag' })
      }),
      { params: { id: comment.id } }
    )
    expect(modRes.status).toBe(200)
    const listRes = await GET(new Request('http://test?verseId=v1'))
    const list = await listRes.json()
    expect(list[0].flagged).toBe(true)
  })

  it('removes a comment', async () => {
    const { POST: create, GET } = await import('../route')
    const { POST: moderate } = await import('../[id]/moderate')
    const createRes = await create(
      new Request('http://test', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ verseId: 'v1', content: 'test' })
      })
    )
    const comment = await createRes.json()
    const modRes = await moderate(
      new Request('http://test', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ verseId: 'v1', action: 'remove' })
      }),
      { params: { id: comment.id } }
    )
    expect(modRes.status).toBe(200)
    const listRes = await GET(new Request('http://test?verseId=v1'))
    const list = await listRes.json()
    expect(list).toHaveLength(0)
  })

  it('returns errors for invalid action and missing comment', async () => {
    const { POST: create } = await import('../route')
    const { POST: moderate } = await import('../[id]/moderate')
    const createRes = await create(
      new Request('http://test', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ verseId: 'v1', content: 'test' })
      })
    )
    const comment = await createRes.json()
    const invalidRes = await moderate(
      new Request('http://test', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ verseId: 'v1', action: 'oops' })
      }),
      { params: { id: comment.id } }
    )
    expect(invalidRes.status).toBe(400)

    const missingRes = await moderate(
      new Request('http://test', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ verseId: 'v1', action: 'flag' })
      }),
      { params: { id: 'missing' } }
    )
    expect(missingRes.status).toBe(404)
  })
})
