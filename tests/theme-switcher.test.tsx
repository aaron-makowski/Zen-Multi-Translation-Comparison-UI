// @vitest-environment jsdom
import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, screen, cleanup } from '@testing-library/react'
import { ThemeSwitcher } from '../components/theme-switcher'

let theme = 'light'
const setTheme = vi.fn()

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme, setTheme })
}), { virtual: true })
vi.mock('../components/ui/button', () => ({
  Button: (props: any) => <button {...props} />
}))

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    setTheme.mockClear()
  })
  afterEach(() => {
    cleanup()
  })

  it('shows moon icon in light mode and toggles to dark', () => {
    theme = 'light'
    render(<ThemeSwitcher />)
    const button = screen.getByRole('button', { name: /toggle theme/i })
    expect(button.querySelector('.lucide-moon')).toBeTruthy()
    fireEvent.click(button)
    expect(setTheme).toHaveBeenCalledWith('dark')
  })

  it('shows sun icon in dark mode and toggles to light', () => {
    theme = 'dark'
    render(<ThemeSwitcher />)
    const button = screen.getByRole('button', { name: /toggle theme/i })
    expect(button.querySelector('.lucide-sun')).toBeTruthy()
    fireEvent.click(button)
    expect(setTheme).toHaveBeenCalledWith('light')
  })
})
