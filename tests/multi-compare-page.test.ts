import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

;(globalThis as any).React = React

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => React.createElement('div', { 'data-testid': 'card' }, children)
}))

vi.mock('../app/compare/multi/verse-selector', () => ({
  VerseSelector: () => React.createElement('div', { 'data-testid': 'selector' })
}))

vi.mock('@/lib/db', () => ({
  prisma: {
    book: { findMany: vi.fn() },
    verse: { findMany: vi.fn() }
  }
}))

import MultiComparePage from '../app/compare/multi/page'
import { prisma } from '@/lib/db'

describe('MultiComparePage', () => {
  it('renders grouped translations for valid selections', async () => {
    ;(prisma.book.findMany as any).mockResolvedValue([])
    ;(prisma.verse.findMany as any).mockResolvedValue([
      {
        id: 'v1',
        number: 1,
        book: { title: 'Book One' },
        translations: [
          { translator: 'T1', text: 'text1' },
          { translator: 'T2', text: 'text2' }
        ]
      },
      {
        id: 'v2',
        number: 2,
        book: { title: 'Book Two' },
        translations: [{ translator: 'T1', text: 'text3' }]
      }
    ])

    const html = renderToStaticMarkup(
      await MultiComparePage({ searchParams: { pairs: 'b1:v1,b2:v2' } })
    )

    expect(html).toContain('Book One')
    expect(html).toContain('Book Two')
    expect(html).toMatch(/Book One.*T1.*Verse\s*1.*text1/)
    expect(html).toMatch(/Book One.*T2.*Verse\s*1.*text2/)
    expect(html).toMatch(/Book Two.*T1.*Verse\s*2.*text3/)
    expect(html).not.toContain('Some requested verses could not be found')
    expect(html).not.toContain('Some verse selections were invalid')
  })

  it('shows invalid selection message when pairs malformed', async () => {
    ;(prisma.book.findMany as any).mockResolvedValue([])
    ;(prisma.verse.findMany as any).mockResolvedValue([
      {
        id: 'v1',
        number: 1,
        book: { title: 'Book One' },
        translations: [{ translator: 'T1', text: 'text1' }]
      }
    ])

    const html = renderToStaticMarkup(
      await MultiComparePage({ searchParams: { pairs: 'b1:v1,bad' } })
    )

    expect(html).toContain('Some verse selections were invalid')
    expect(html).toContain('Book One')
    expect(html).toContain('text1')
  })

  it('shows missing verse message when verse not found', async () => {
    ;(prisma.book.findMany as any).mockResolvedValue([])
    ;(prisma.verse.findMany as any).mockResolvedValue([
      {
        id: 'v1',
        number: 1,
        book: { title: 'Book One' },
        translations: [{ translator: 'T1', text: 'text1' }]
      }
    ])

    const html = renderToStaticMarkup(
      await MultiComparePage({ searchParams: { pairs: 'b1:v1,b2:v2' } })
    )

    expect(html).toContain('Some requested verses could not be found')
    expect(html).toContain('Book One')
    expect(html).toContain('text1')
  })
})
