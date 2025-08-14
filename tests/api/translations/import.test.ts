import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/schema', () => ({ translations: {} }))

vi.mock('@/lib/db', () => {
  const valuesMock = vi.fn().mockResolvedValue(undefined)
  const insertMock = vi.fn().mockReturnValue({ values: valuesMock })
  return {
    db: { insert: insertMock },
    valuesMock,
    insertMock,
  }
})

const { POST } = await import('../../../app/api/translations/import/route')
const { valuesMock, insertMock } = await import('@/lib/db')

function createRequest(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return new Request('http://localhost/api/translations/import', {
    method: 'POST',
    body: formData,
  })
}

describe('POST /api/translations/import', () => {
  beforeEach(() => {
    insertMock.mockClear()
    valuesMock.mockClear()
  })

  it('imports translations from JSON file', async () => {
    const records = [
      { text: 'Hello', translator: 'John', language: 'Latin', verseId: 'v1' }
    ]
    const file = new File([JSON.stringify(records)], 't.json', {
      type: 'application/json'
    })
    const res = await POST(createRequest(file))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ imported: 1 })
    expect(insertMock).toHaveBeenCalled()
    const inserted = valuesMock.mock.calls[0][0][0]
    expect(inserted).toMatchObject({
      text: 'Hello',
      translator: 'John',
      language: 'Latin',
      verseId: 'v1'
    })
  })

  it('imports translations from CSV file', async () => {
    const csv = 'text,translator,verseId\nHello,Jane,v2'
    const file = new File([csv], 't.csv', { type: 'text/csv' })
    const res = await POST(createRequest(file))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ imported: 1 })
    const inserted = valuesMock.mock.calls[0][0][0]
    expect(inserted).toMatchObject({
      text: 'Hello',
      translator: 'Jane',
      verseId: 'v2',
      language: 'English'
    })
  })

  it('returns error for missing fields', async () => {
    const records = [{ text: 'Only text', verseId: 'v1' }]
    const file = new File([JSON.stringify(records)], 'bad.json', {
      type: 'application/json'
    })
    const res = await POST(createRequest(file))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'Missing fields' })
    expect(insertMock).not.toHaveBeenCalled()
  })

  it('returns error for malformed file', async () => {
    const file = new File(['{bad json'], 'bad.json', {
      type: 'application/json'
    })
    const res = await POST(createRequest(file))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'Invalid file' })
    expect(insertMock).not.toHaveBeenCalled()
  })
})
