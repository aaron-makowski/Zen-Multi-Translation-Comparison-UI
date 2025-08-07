import { describe, it, expect } from 'vitest'
import initSqlJs from 'sql.js'

describe('multi-book comparison', () => {
  it('returns verses for multiple books', async () => {
    const SQL = await initSqlJs()
    const db = new SQL.Database()
    db.run(`
      CREATE TABLE books (id TEXT PRIMARY KEY, title TEXT);
      CREATE TABLE verses (id TEXT PRIMARY KEY, number INTEGER, book_id TEXT);
      INSERT INTO books (id, title) VALUES ('b1','Book 1'), ('b2','Book 2');
      INSERT INTO verses (id, number, book_id) VALUES ('v1',1,'b1'), ('v2',1,'b2');
    `)
    const res = db.exec(
      "SELECT b.id as bookId, v.id as verseId, v.number as number FROM books b JOIN verses v ON b.id = v.book_id WHERE b.id IN ('b1','b2') ORDER BY b.id, v.number"
    )
    const rows = res[0].values.map((r) => ({ bookId: r[0] as string, verseId: r[1] as string, number: r[2] as number }))
    const result = rows.reduce<Record<string, { id: string; number: number }[]>>((acc, row) => {
      acc[row.bookId] = acc[row.bookId] || []
      acc[row.bookId].push({ id: row.verseId, number: row.number })
      return acc
    }, {})
    expect(result).toEqual({
      b1: [{ id: 'v1', number: 1 }],
      b2: [{ id: 'v2', number: 1 }]
    })
  })
})
