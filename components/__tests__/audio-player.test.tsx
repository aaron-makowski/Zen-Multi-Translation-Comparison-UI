/**
 * @vitest-environment jsdom
 */
import React from 'react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'

vi.mock('@/components/ui/button', () => ({
  Button: (props: any) => <button {...props} />,
}))

import { AudioPlayer } from '../audio-player'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('AudioPlayer', () => {
  it('plays audio when src is provided', () => {
    const playSpy = vi
      .spyOn(HTMLMediaElement.prototype, 'play')
      .mockImplementation(() => Promise.resolve())

    render(<AudioPlayer src="/test.mp3" />)
    const button = screen.getByRole('button', { name: /play audio/i })
    fireEvent.click(button)

    expect(playSpy).toHaveBeenCalled()
  })

  it('speaks text when only text is provided', () => {
    const speakMock = vi.fn()
    ;(window as any).speechSynthesis = { speak: speakMock }
    class MockUtterance {
      text: string
      constructor(text: string) {
        this.text = text
      }
    }
    ;(window as any).SpeechSynthesisUtterance = MockUtterance

    render(<AudioPlayer text="Hello world" />)
    const button = screen.getByRole('button', { name: /speak text/i })
    fireEvent.click(button)

    expect(speakMock).toHaveBeenCalled()
    const utteranceArg = speakMock.mock.calls[0][0] as any
    expect(utteranceArg.text).toBe('Hello world')
  })

  it('renders appropriate button label', () => {
    const { rerender } = render(<AudioPlayer src="/test.mp3" />)
    expect(screen.getByRole('button').textContent).toBe('Play audio')

    rerender(<AudioPlayer text="Hi" />)
    expect(screen.getByRole('button').textContent).toBe('Speak text')
  })
})
