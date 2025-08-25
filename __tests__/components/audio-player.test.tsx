// @vitest-environment jsdom
import React from 'react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, fireEvent, act, cleanup } from '@testing-library/react'

vi.mock('@/components/ui/button', () => ({ Button: (props: any) => <button {...props} /> }))
import { AudioPlayer } from '../../components/audio-player'

afterEach(cleanup)

describe('AudioPlayer', () => {
  it('uses speech synthesis when only text is provided', async () => {
    const speakMock = vi.fn()
    const cancelMock = vi.fn()
    class MockUtterance {
      text: string
      onend: (() => void) | null = null
      constructor(text: string) {
        this.text = text
      }
    }
    Object.defineProperty(window, 'speechSynthesis', {
      value: { speak: speakMock, cancel: cancelMock },
      configurable: true
    })
    // @ts-ignore
    globalThis.SpeechSynthesisUtterance = MockUtterance

    const { getByRole } = render(<AudioPlayer text="hello" />)
    const button = getByRole('button')

    fireEvent.click(button)
    expect(speakMock).toHaveBeenCalled()
    expect(button.textContent).toBe('Stop')

    const utterance = speakMock.mock.calls[0][0] as MockUtterance
    await act(async () => {
      utterance.onend && utterance.onend()
    })
    expect(button.textContent).toBe('Play')

    fireEvent.click(button)
    fireEvent.click(button)
    expect(cancelMock).toHaveBeenCalled()
    expect(button.textContent).toBe('Play')
  })

  it('plays audio when src is provided', async () => {
    const playMock = vi.fn().mockResolvedValue(undefined)
    const pauseMock = vi.fn()

    const { getByRole, container } = render(<AudioPlayer src="/test.mp3" />)
    const audio = container.querySelector('audio') as HTMLAudioElement
    audio.play = playMock as any
    audio.pause = pauseMock as any
    audio.currentTime = 5

    const button = getByRole('button')
    fireEvent.click(button)
    expect(playMock).toHaveBeenCalled()
    expect(button.textContent).toBe('Stop')

    await act(async () => { fireEvent.ended(audio) })
    expect(button.textContent).toBe('Play')

    fireEvent.click(button) // play
    fireEvent.click(button) // stop
    expect(pauseMock).toHaveBeenCalled()
    expect(audio.currentTime).toBe(0)
    expect(button.textContent).toBe('Play')
  })

  it('prefers audio src when both text and src are provided', () => {
    const playMock = vi.fn().mockResolvedValue(undefined)
    const speakMock = vi.fn()
    Object.defineProperty(window, 'speechSynthesis', {
      value: { speak: speakMock, cancel: vi.fn() },
      configurable: true
    })
    class MockUtterance {
      constructor(public text: string) {}
    }
    // @ts-ignore
    globalThis.SpeechSynthesisUtterance = MockUtterance

    const { getByRole, container } = render(<AudioPlayer text="hi" src="/test.mp3" />)
    const audio = container.querySelector('audio') as HTMLAudioElement
    audio.play = playMock as any

    const button = getByRole('button')
    fireEvent.click(button)
    expect(playMock).toHaveBeenCalled()
    expect(speakMock).not.toHaveBeenCalled()
    expect(button.textContent).toBe('Stop')
  })
})

