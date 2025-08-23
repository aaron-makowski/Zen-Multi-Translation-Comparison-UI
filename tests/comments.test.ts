import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { promises as fs } from 'fs'
import os from 'os'
import path from 'path'

let GET: any
let POST: any
let originalCwd: string
let tmpDir: string
let redis: any
let readFileSpy: any

describe('comments API', () => {
  beforeEach(async () => {
    originalCwd = process.cwd()
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'comments-'))
    process.chdir(tmpDir)
    await fs.mkdir(path.join(tmpDir, 'data'), { recursive: true })
    await fs.writeFile(
      path.join(tmpDir, 'data', 'comments.json'),
      JSON.stringify({ verse1: [{ id: 'c1', content: 'hi', createdAt: '', votes: 0 }] })
    )

    const store = new Map<string, any>()
    redis = {
      get: vi.fn(async (k: string) => store.get(k)),
      set: vi.fn(async (k: string, v: any) => {
        store.set(k, v)
      }),
      del: vi.fn(async (k: string) => {
        store.delete(k)
      })
    }
    vi.mock('@upstash/redis', () => ({ Redis: { fromEnv: () => redis } }))

    readFileSpy = vi.spyOn(fs, 'readFile')
    ;({ GET, POST } = await import('../app/api/comments/route'))
  })

  afterEach(async () => {
    vi.resetModules()
    vi.clearAllMocks()
    process.chdir(originalCwd)
  })

  it('serves and caches comments, invalidating after new comment', async () => {
    const req = new Request('http://test/comments?verseId=verse1')
    const initialReads = readFileSpy.mock.calls.length
    const res1 = await GET(req)
    const data1 = await res1.json()
    expect(data1).toHaveLength(1)
    expect(readFileSpy.mock.calls.length).toBe(initialReads + 1)

    const res2 = await GET(req)
    await res2.json()
    expect(readFileSpy.mock.calls.length).toBe(initialReads + 1)

    const postRes = await POST(
      new Request('http://test/comments', {
        method: 'POST',
        body: JSON.stringify({ verseId: 'verse1', content: 'second' })
      })
    )
    expect(postRes.status).toBe(200)
    expect(redis.del).toHaveBeenCalledWith('comments:verse1')

    const res3 = await GET(req)
    const data3 = await res3.json()
    expect(data3).toHaveLength(2)
    expect(readFileSpy.mock.calls.length).toBe(initialReads + 3)
  })

  it('returns 400 when required fields are missing', async () => {
    const res = await POST(
      new Request('http://test/comments', { method: 'POST', body: JSON.stringify({}) })
    )
    expect(res.status).toBe(400)
  })
})
