import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'

let user: { id: string; karma: number; streak: number; lastActive: Date }

vi.mock('@/lib/gamification', () => ({
  addKarma: async () => {
    const now = new Date()
    const diff = Math.floor((now.getTime() - user.lastActive.getTime()) / 86_400_000)
    if (diff === 1) user.streak += 1
    else if (diff > 1) user.streak = 1
    user.karma += 5
    user.lastActive = now
    return { karma: user.karma, streak: user.streak, badge: { name: 'Novice', karma: 0 } }
  }
}))

describe('POST /api/comments', () => {
  const userId = 'user1'
  let tmpDir: string
  let originalCwd: string

  beforeEach(async () => {
    vi.useFakeTimers()
    const now = new Date('2024-01-02T00:00:00Z')
    vi.setSystemTime(now)
    user = { id: userId, karma: 0, streak: 1, lastActive: new Date(now.getTime() - 86_400_000) }
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'comments-test-'))
    originalCwd = process.cwd()
    process.chdir(tmpDir)
  })

  afterEach(() => {
    vi.useRealTimers()
    process.chdir(originalCwd)
    vi.resetModules()
  })

  it('increments karma and updates streak and lastActive', async () => {
    const { POST } = await import('../../app/api/comments/route')
    const req = new Request('http://localhost/api/comments', {
      method: 'POST',
      body: JSON.stringify({ verseId: 'v1', content: 'hi', userId }),
      headers: { 'Content-Type': 'application/json' }
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    await res.json()
    expect(user.karma).toBe(5)
    expect(user.streak).toBe(2)
    expect(user.lastActive.toISOString()).toBe(new Date().toISOString())
  })
})
