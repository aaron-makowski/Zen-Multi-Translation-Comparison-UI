import { describe, it, expect } from 'vitest'
import { getKarmaBadge } from './karma'

describe('getKarmaBadge', () => {
  it('returns Sage badge at 1000 karma', () => {
    expect(getKarmaBadge(1000)).toEqual({ label: 'Sage', color: 'text-purple-600' })
  })

  it('returns Adept badge at 500 karma', () => {
    expect(getKarmaBadge(500)).toEqual({ label: 'Adept', color: 'text-blue-600' })
  })

  it('returns Contributor badge at 100 karma', () => {
    expect(getKarmaBadge(100)).toEqual({ label: 'Contributor', color: 'text-green-600' })
  })

  it('returns Novice badge below 100 karma', () => {
    expect(getKarmaBadge(99)).toEqual({ label: 'Novice', color: 'text-gray-500' })
  })
})

