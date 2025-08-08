import { describe, it, expect, vi } from 'vitest'

vi.mock('@/data/verse-alignment.json', () => ({
  default: {
    1: { waley: 1, suzuki: 1, goddard: 1 },
    2: { waley: 2, suzuki: 2, goddard: 2 },
  },
}))

vi.mock('./translations', () => ({
  translations: {
    xinxinming: {
      verses: [
        {
          id: 1,
          lines: [
            {
              chinese: '',
              translations: {
                waley: 'Trust in mind',
                suzuki: 'Mind is like water',
                goddard: 'Trust yourself',
              },
            },
          ],
        },
        {
          id: 2,
          lines: [
            {
              chinese: '',
              translations: {
                waley: 'No mind, no problem',
                suzuki: 'Mind at rest',
                goddard: 'Trust in nothing',
              },
            },
          ],
        },
      ],
    },
  },
}))

import { getMappedVerse, filterByKeyword } from './verse-utils'

describe('getMappedVerse', () => {
  it('finds base verse mapping for waley', () => {
    expect(getMappedVerse('waley', 1)).toEqual({
      baseVerse: 1,
      mapping: { waley: 1, suzuki: 1, goddard: 1 },
    })
  })

  it('finds base verse mapping for suzuki', () => {
    expect(getMappedVerse('suzuki', 2)).toEqual({
      baseVerse: 2,
      mapping: { waley: 2, suzuki: 2, goddard: 2 },
    })
  })

  it('returns null when mapping not found', () => {
    expect(getMappedVerse('waley', 99)).toBeNull()
  })
})

describe('filterByKeyword', () => {
  it('returns verses for matching keyword', () => {
    expect(filterByKeyword('nothing')).toEqual([
      { baseVerse: 2, translator: 'goddard', text: 'Trust in nothing' },
    ])
  })

  it('returns empty array for empty keyword', () => {
    expect(filterByKeyword('')).toEqual([])
  })

  it('returns empty array when no match found', () => {
    expect(filterByKeyword('banana')).toEqual([])
  })
})
