import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'

let GET: () => Promise<Response>
let POST: (req: Request) => Promise<Response>
let DELETE: (req: Request) => Promise<Response>
let tempDir: string

beforeEach(async () => {
  vi.resetModules()
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bookmarks-'))
  vi.spyOn(process, 'cwd').mockReturnValue(tempDir)
  ;({ GET, POST, DELETE } = await import('./route'))
})

afterEach(async () => {
  vi.restoreAllMocks()
  await fs.rm(tempDir, { recursive: true, force: true })
})

describe('bookmarks API', () => {
  it('creates and retrieves bookmarks', async () => {
    const postRes = await POST(
      new Request('http://test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verseId: '1' })
      })
    )
    expect(postRes.status).toBe(200)
    expect(await postRes.json()).toEqual({ verseId: '1' })

    const getRes = await GET()
    expect(getRes.status).toBe(200)
    expect(await getRes.json()).toEqual(['1'])
  })

  it('deletes bookmarks', async () => {
    await POST(
      new Request('http://test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verseId: '1' })
      })
    )

    const deleteRes = await DELETE(
      new Request('http://test', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verseId: '1' })
      })
    )
    expect(deleteRes.status).toBe(200)
    expect(await deleteRes.json()).toEqual({ verseId: '1' })

    const getRes = await GET()
    expect(await getRes.json()).toEqual([])
  })

  it('errors on missing verseId for POST', async () => {
    const res = await POST(
      new Request('http://test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
    )
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'Missing verseId' })
  })

  it('errors on missing verseId for DELETE', async () => {
    const res = await DELETE(
      new Request('http://test', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
    )
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'Missing verseId' })
  })
})

