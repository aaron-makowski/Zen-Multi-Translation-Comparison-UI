import { describe, it, expect, beforeAll, beforeEach, afterAll, vi } from 'vitest'
import path from 'path'
import fs from 'fs/promises'

// mock next/cache to capture revalidateTag calls and disable caching
const { revalidateTagMock } = vi.hoisted(() => ({
  revalidateTagMock: vi.fn(),
}))
vi.mock('next/cache', () => ({
  unstable_cache: (fn: any) => fn,
  revalidateTag: revalidateTagMock,
}))

// mock database insert used in import route
vi.mock('@/lib/db', () => ({
  db: {
    insert: () => ({ values: vi.fn().mockResolvedValue(undefined) }),
  },
}))

vi.mock('@/lib/schema', () => ({ translations: {} }))

import { translations as defaultTranslations } from '../lib/translations'
import { GET as getVerses } from '../app/api/v1/verses/route'
import { GET as getTranslations } from '../app/api/v1/translations/route'
import { POST as importTranslations } from '../app/api/translations/import'

const CACHE_PATH = path.join(process.cwd(), 'data', 'verses.json')
let originalData = ''

beforeAll(async () => {
  originalData = await fs.readFile(CACHE_PATH, 'utf8')
})

beforeEach(async () => {
  await fs.writeFile(CACHE_PATH, originalData)
  revalidateTagMock.mockClear()
})

afterAll(async () => {
  await fs.writeFile(CACHE_PATH, originalData)
})

describe('verse API caching', () => {
  it('serves verses from cache after import and triggers revalidation', async () => {
    const req = new Request('http://localhost/api/v1/verses?book=xinxinming')
    let res = await getVerses(req)
    let verses = await res.json()
    expect(verses[0].lines[0].translations).not.toHaveProperty('tester')

    const fd = new FormData()
    const file = new File(
      [JSON.stringify([{ verseId: 1, translator: 'tester', text: 'Hello world' }])],
      'import.json',
      { type: 'application/json' }
    )
    fd.append('file', file)
    await importTranslations(
      new Request('http://localhost/api/translations/import', { method: 'POST', body: fd })
    )

    expect(revalidateTagMock).toHaveBeenCalledWith('verses')
    expect(revalidateTagMock).toHaveBeenCalledWith('translations')

    res = await getVerses(req)
    verses = await res.json()
    expect(verses[0].lines[0].translations.tester).toBe('Hello world')

    const tRes = await getTranslations(
      new Request('http://localhost/api/v1/translations?verseId=1')
    )
    const list = await tRes.json()
    expect(list.some((t: any) => t.translator === 'tester')).toBe(true)
  })

  it('falls back to default translations when cache file is missing', async () => {
    await fs.unlink(CACHE_PATH)
    const res = await getVerses(
      new Request('http://localhost/api/v1/verses?book=xinxinming')
    )
    const verses = await res.json()
    expect(verses).toEqual(defaultTranslations.xinxinming.verses)
  })

  it('falls back to default translations when cache file is corrupt', async () => {
    await fs.writeFile(CACHE_PATH, '{ not: valid json')
    const res = await getVerses(
      new Request('http://localhost/api/v1/verses?book=xinxinming')
    )
    const verses = await res.json()
    expect(verses).toEqual(defaultTranslations.xinxinming.verses)
  })
})
