// @vitest-environment jsdom
import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { useShortcuts } from '../hooks/use-shortcuts'

function TestComponent(props: any) {
  useShortcuts(props)
  return null
}

describe('useShortcuts', () => {
  it('handles next and previous verse keys', () => {
    const next = vi.fn()
    const prev = vi.fn()
    render(<TestComponent onNextVerse={next} onPrevVerse={prev} />)
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    expect(next).toHaveBeenCalledTimes(1)
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
    expect(prev).toHaveBeenCalledTimes(1)
  })

  it('handles search key and prevents default for "/"', () => {
    const search = vi.fn()
    render(<TestComponent onSearch={search} />)
    const event = new KeyboardEvent('keydown', { key: '/', cancelable: true })
    const prevent = vi.fn()
    Object.defineProperty(event, 'preventDefault', { value: prevent })
    window.dispatchEvent(event)
    expect(search).toHaveBeenCalledTimes(1)
    expect(prevent).toHaveBeenCalled()
  })

  it('handles search key and prevents default for Ctrl+F', () => {
    const search = vi.fn()
    render(<TestComponent onSearch={search} />)
    const event = new KeyboardEvent('keydown', { key: 'f', ctrlKey: true, cancelable: true })
    const prevent = vi.fn()
    Object.defineProperty(event, 'preventDefault', { value: prevent })
    window.dispatchEvent(event)
    expect(search).toHaveBeenCalledTimes(1)
    expect(prevent).toHaveBeenCalled()
  })
})
