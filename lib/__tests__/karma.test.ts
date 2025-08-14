import { describe, it, expect } from 'vitest'
import { getBadge } from '../karma'

describe('getBadge', () => {
  const cases = [
    { karma: 0, label: 'Newcomer', className: 'text-gray-500' },
    { karma: 10, label: 'Apprentice', className: 'text-green-600' },
    { karma: 100, label: 'Adept', className: 'text-blue-600' },
    { karma: 500, label: 'Expert', className: 'text-purple-600' },
    { karma: 1000, label: 'Master', className: 'text-yellow-600' }
  ]

  cases.forEach(({ karma, label, className }) => {
    it(`returns ${label} badge for karma ${karma}`, () => {
      const badge = getBadge(karma)
      expect(badge).toEqual({ label, className })
    })
  })
})
