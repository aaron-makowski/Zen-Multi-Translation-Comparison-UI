/* @vitest-environment jsdom */
import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ComparePage from '../app/compare/page'

describe('ComparePage', () => {
  it('links to each sutra with correct info', () => {
    render(<ComparePage />)

    const platform = screen.getByRole('link', { name: /Platform Sutra/i })
    expect(platform.getAttribute('href')).toBe('/books/platform-sutra')
    expect(platform.getAttribute('aria-disabled')).toBeNull()
    expect(screen.getByText(/Huineng's teachings/)).toBeDefined()

    const heart = screen.getByRole('link', { name: /Heart Sutra/i })
    expect(heart.getAttribute('href')).toBe('/books/heart-sutra')
    expect(heart.getAttribute('aria-disabled')).toBeNull()
    expect(screen.getByText(/Heart of Perfect Wisdom/)).toBeDefined()

    const diamond = screen.getByRole('link', { name: /Diamond Sutra/i })
    expect(diamond.getAttribute('href')).toBe('/books/diamond-sutra')
    expect(diamond.getAttribute('aria-disabled')).toBeNull()
    expect(screen.getByText(/classic Buddhist text/)).toBeDefined()
  })
})
