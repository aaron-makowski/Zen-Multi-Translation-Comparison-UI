// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'
import React from 'react'
import { ThemeSwitcher } from '../theme-switcher'

expect.extend(matchers)

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    document.documentElement.className = ''
    window.localStorage.clear()
  })
  afterEach(() => cleanup())

  it('initializes from localStorage when value exists', async () => {
    window.localStorage.setItem('theme', 'dark')
    render(<ThemeSwitcher />)
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
    const button = screen.getByRole('button', { name: /toggle theme/i })
    expect(button.querySelector('svg.lucide-sun')).toBeInTheDocument()
  })

  it('initializes from root class when no storage value', async () => {
    document.documentElement.classList.add('dark')
    render(<ThemeSwitcher />)
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
    const button = screen.getByRole('button', { name: /toggle theme/i })
    expect(button.querySelector('svg.lucide-sun')).toBeInTheDocument()
  })

  it('toggles theme and updates root class and localStorage', async () => {
    render(<ThemeSwitcher />)
    const button = screen.getByRole('button', { name: /toggle theme/i })

    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(window.localStorage.getItem('theme')).toBeNull()
    expect(button.querySelector('svg.lucide-moon')).toBeInTheDocument()

    fireEvent.click(button)
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
    expect(window.localStorage.getItem('theme')).toBe('dark')
    expect(button.querySelector('svg.lucide-sun')).toBeInTheDocument()

    fireEvent.click(button)
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
    expect(window.localStorage.getItem('theme')).toBe('light')
    expect(button.querySelector('svg.lucide-moon')).toBeInTheDocument()
  })
})
