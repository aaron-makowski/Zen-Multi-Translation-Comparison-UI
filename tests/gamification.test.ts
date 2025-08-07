import { describe, it, expect, vi } from 'vitest'
import {
  getBadge,
  calculateStreak,
  progressToNextBadge,
  addKarmaPoints,
} from '../lib/gamification'
import { sql } from 'drizzle-orm'
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'

let db: any

vi.mock('../lib/db', () => ({
  get db() {
    return db
  },
}))

describe('gamification helpers', () => {
  it('awards badges based on karma', () => {
    expect(getBadge(0)).toBe('Novice')
    expect(getBadge(60)).toBe('Scholar')
  })

  it('calculates activity streak', () => {
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)
    expect(calculateStreak([today, yesterday])).toBe(2)
  })

  it('computes progress to next badge', () => {
    expect(progressToNextBadge(5)).toBeCloseTo(50)
  })

  it('adds karma points for a comment', async () => {
    db = drizzle(new PGlite())
    await db.execute(
      sql`create table users (id text primary key, karma integer default 0)`
    )
    await db.execute(sql`insert into users (id, karma) values ('u1', 0)`)
    await addKarmaPoints('u1', 'comment')
    const res = await db.execute(
      sql`select karma from users where id = 'u1'`
    )
    expect(res.rows[0].karma).toBe(1)
  })
})
