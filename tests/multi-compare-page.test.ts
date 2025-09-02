import { describe, it, expect, beforeEach, vi } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

;(globalThis as any).React = React

const { booksFindMany, versesFindMany } = vi.hoisted(() => ({
  booksFindMany: vi.fn(),
  versesFindMany: vi.fn(),
}))

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) =>
    React.createElement('div', { 'data-testid': 'card' }, children),
}))

vi.mock('../app/compare/multi/verse-selector', () => ({
  VerseSelector: () => React.createElement('div', { 'data-testid': 'selector' }),
}))

vi.mock('@/lib/db', () => ({
  db: {
    query: {
      books: { findMany: booksFindMany },
      verses: { findMany: versesFindMany },
    },
  },
}))

vi.mock('@/lib/schema', () => ({ verses: {} }))

import MultiComparePage from '../app/compare/multi/page'

describe('MultiComparePage', () => {
  beforeEach(() => {
    booksFindMany.mockReset()
    versesFindMany.mockReset()
  })

  it('renders grouped translations for valid selections', async () => {
    booksFindMany.mockResolvedValue([])
    versesFindMany.mockResolvedValue([
      {
        id: 'v1',
        number: 1,
        book: { title: 'Book One' },
        translations: [
          { translator: 'T1', text: 'text1' },
          { translator: 'T2', text: 'text2' },
        ],
      },
      {
        id: 'v2',
        number: 2,
        book: { title: 'Book Two' },
        translations: [{ translator: 'T1', text: 'text3' }],
      },
    ])

    const html = renderToStaticMarkup(
      await MultiComparePage({ searchParams: { ids: 'v1,v2' } })
    )

    expect(html).toContain('Book One - Verse 1')
    expect(html).toContain('Book Two - Verse 2')
    expect(html).toContain('T1')
    expect(html).toContain('text1')
    expect(html).toContain('T2')
    expect(html).toContain('text2')
    expect(html).toContain('text3')
  })

  it('handles missing verses gracefully', async () => {
    booksFindMany.mockResolvedValue([])
    versesFindMany.mockResolvedValue([
      {
        id: 'v1',
        number: 1,
        book: { title: 'Book One' },
        translations: [{ translator: 'T1', text: 'text1' }],
      },
    ])

    const html = renderToStaticMarkup(
      await MultiComparePage({ searchParams: { ids: 'v1,v2' } })
    )

    expect(html).toContain('Book One')
    expect(html).not.toContain('Book Two')
  })
})

