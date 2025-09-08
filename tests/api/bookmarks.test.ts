import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'

let GET: () => Promise<Response>
let POST: (req: Request) => Promise<Response>
let DELETE_: (req: Request) => Promise<Response>
let tempDir: string

beforeEach(async () => {
  vi.resetModules()
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'bookmarks-'))
  vi.spyOn(process, 'cwd').mockReturnValue(tempDir)
  ;({ GET, POST, DELETE: DELETE_ } = await import('../../app/api/bookmarks/route'))
})

afterEach(async () => {
  vi.restoreAllMocks()
  await fs.rm(tempDir, { recursive: true, force: true })
})

describe('bookmarks API', () => {
  it('adds and lists bookmarks', async () => {
    await POST(
      new Request('http://test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verseId: '1' })
      })
    )
    const res = await GET()
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual(['1'])
  })

  it('removes bookmarks', async () => {
    await POST(
      new Request('http://test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verseId: '1' })
      })
    )
    await DELETE_(
      new Request('http://test', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verseId: '1' })
      })
    )
    const res = await GET()
    expect(await res.json()).toEqual([])
  })
})

