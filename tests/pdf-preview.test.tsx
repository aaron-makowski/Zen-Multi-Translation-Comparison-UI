// @vitest-environment jsdom
import React from 'react'
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PdfPreviewPage from '../app/[locale]/pdf-preview/page'

describe('PdfPreviewPage', () => {
  const mockBooks = [
    { id: 'b1', title: 'Book 1', translators: ['T1', 'T2'] },
    { id: 'b2', title: 'Book 2', translators: ['T3'] },
  ]

  beforeEach(() => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: async () => mockBooks,
    } as any)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('allows selecting book and translator and embeds correct pdf url', async () => {
    const { container } = render(<PdfPreviewPage />)

    await screen.findByRole('option', { name: 'Book 1' })

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'b1' } })
    await screen.findByRole('option', { name: 'T1' })

    fireEvent.change(screen.getAllByRole('combobox')[1], { target: { value: 'T1' } })

    await waitFor(() => {
      const obj = container.querySelector('object')
      expect(obj).not.toBeNull()
      expect(obj?.getAttribute('data')).toBe('/api/books/b1/pdf?translator=T1')
    })
  })
})
