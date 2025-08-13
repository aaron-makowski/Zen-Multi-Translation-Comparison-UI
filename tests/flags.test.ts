import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flags, auditLogs } from '../lib/schema'

// Hoisted mocks
const { insertMock, selectMock, deleteMock } = vi.hoisted(() => ({
  insertMock: vi.fn(),
  selectMock: vi.fn(),
  deleteMock: vi.fn(),
}))

vi.mock('../lib/db', () => ({
  db: {
    insert: insertMock,
    select: selectMock,
    delete: deleteMock,
  },
}))

const { getUserFromRequest } = vi.hoisted(() => ({ getUserFromRequest: vi.fn() }))
vi.mock('../lib/auth', () => ({ getUserFromRequest }))

const { uuidMock } = vi.hoisted(() => ({ uuidMock: vi.fn() }))
vi.mock('uuid', () => ({ v4: uuidMock }))

// Import after mocks are declared so they receive the mocked modules
import { GET as getFlags, POST as postFlag } from '../app/api/flags/route'
import { DELETE as deleteFlag } from '../app/api/flags/[id]/route'

describe('Flags API', () => {
  beforeEach(() => {
    insertMock.mockReset()
    selectMock.mockReset()
    deleteMock.mockReset()
    getUserFromRequest.mockReset()
    uuidMock.mockReset()
  })

  it('POST /api/flags creates a flag and writes an audit log', async () => {
    const insertCalls: any[] = []
    insertMock.mockImplementation((table) => ({
      values: (val: any) => {
        insertCalls.push({ table, val })
        return Promise.resolve()
      },
    }))
    getUserFromRequest.mockReturnValue({ id: 'user1', role: 'user' })
    uuidMock.mockReturnValueOnce('flag-1').mockReturnValueOnce('audit-1')

    const req = new Request('http://localhost/api/flags', {
      method: 'POST',
      body: JSON.stringify({ commentId: 'comment1', reason: 'spam' }),
      headers: { 'Content-Type': 'application/json' },
    })

    const res = await postFlag(req)
    const body = await res.json()

    expect(body).toEqual({ id: 'flag-1', commentId: 'comment1', reason: 'spam' })
    expect(insertCalls.length).toBe(2)
    expect(insertCalls[0].table).toBe(flags)
    expect(insertCalls[1].table).toBe(auditLogs)
    expect(insertCalls[1].val).toMatchObject({
      userId: 'user1',
      action: 'flag_created',
      targetType: 'comment',
      targetId: 'comment1',
    })
  })

  it('POST /api/flags returns 400 for missing commentId', async () => {
    getUserFromRequest.mockReturnValue({ id: 'user1', role: 'user' })
    const req = new Request('http://localhost/api/flags', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await postFlag(req)
    expect(res.status).toBe(400)
  })

  it('POST /api/flags returns 401 without auth', async () => {
    getUserFromRequest.mockReturnValue(null)
    const req = new Request('http://localhost/api/flags', {
      method: 'POST',
      body: JSON.stringify({ commentId: 'comment1' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await postFlag(req)
    expect(res.status).toBe(401)
  })

  it('GET /api/flags retrieves all flags', async () => {
    const allFlags = [{ id: 'flag-1' }]
    selectMock.mockReturnValue({ from: () => Promise.resolve(allFlags) })

    const res = await getFlags()
    const body = await res.json()
    expect(body).toEqual(allFlags)
  })

  it('DELETE /api/flags/[id] removes flag and writes audit log', async () => {
    deleteMock.mockReturnValue({ where: () => Promise.resolve() })
    const insertCalls: any[] = []
    insertMock.mockImplementation((table) => ({
      values: (val: any) => {
        insertCalls.push({ table, val })
        return Promise.resolve()
      },
    }))
    getUserFromRequest.mockReturnValue({ id: 'user1', role: 'admin' })
    uuidMock.mockReturnValue('audit-1')

    const req = new Request('http://localhost/api/flags/flag-1', { method: 'DELETE' })
    const res = await deleteFlag(req, { params: { id: 'flag-1' } })
    const body = await res.json()

    expect(body).toEqual({ success: true })
    expect(deleteMock).toHaveBeenCalledTimes(1)
    expect(insertCalls.length).toBe(1)
    expect(insertCalls[0].table).toBe(auditLogs)
    expect(insertCalls[0].val).toMatchObject({
      userId: 'user1',
      action: 'flag_removed',
      targetType: 'flag',
      targetId: 'flag-1',
    })
  })

  it('DELETE /api/flags/[id] returns 401 without auth', async () => {
    getUserFromRequest.mockReturnValue(null)
    const req = new Request('http://localhost/api/flags/flag-1', { method: 'DELETE' })
    const res = await deleteFlag(req, { params: { id: 'flag-1' } })
    expect(res.status).toBe(401)
  })
})
