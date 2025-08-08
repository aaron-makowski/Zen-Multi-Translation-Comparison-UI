// @vitest-environment jsdom
import React from 'react'
import { render, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

vi.mock('@/components/ui/button', () => ({
  Button: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} />
}), { virtual: true })

import ThemeSwitcher from '../theme-switcher'

// Reset DOM and storage before each test
beforeEach(() => {
  document.documentElement.classList.remove('dark')
  localStorage.clear()
})

afterEach(() => {
  cleanup()
})

describe('ThemeSwitcher', () => {
  it('toggles dark mode and stores preference', () => {
    const { getByRole } = render(<ThemeSwitcher />)
    const button = getByRole('button', { name: /toggle theme/i })

    // initial state
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('theme')).toBeNull()
    expect(document.querySelector('svg')?.classList.contains('lucide-moon')).toBe(true)

    // toggle to dark
    fireEvent.click(button)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')
    expect(document.querySelector('svg')?.classList.contains('lucide-sun')).toBe(true)

    // toggle back to light
    fireEvent.click(button)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('theme')).toBe('light')
    expect(document.querySelector('svg')?.classList.contains('lucide-moon')).toBe(true)
  })

  it('loads user preference from localStorage', () => {
    localStorage.setItem('theme', 'dark')
    render(<ThemeSwitcher />)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.querySelector('svg')?.classList.contains('lucide-sun')).toBe(true)
  })
})

