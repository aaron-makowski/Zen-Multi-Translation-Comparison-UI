import { describe, it, expect } from 'vitest'
import initSqlJs from 'sql.js'

async function seedDb() {
  const SQL = await initSqlJs()
  const db = new SQL.Database()
  db.run(`
    CREATE TABLE books (id TEXT PRIMARY KEY, title TEXT);
    CREATE TABLE verses (id TEXT PRIMARY KEY, number INTEGER, book_id TEXT);
    INSERT INTO books (id, title) VALUES ('b1','Book 1'), ('b2','Book 2');
    INSERT INTO verses (id, number, book_id) VALUES
      ('v1',1,'b1'), ('v2',2,'b1'),
      ('v3',1,'b2'), ('v4',2,'b2');
  `)
  return db
}

describe('multi-book comparison', () => {
  it('aggregates verses by book', async () => {
    const db = await seedDb()
    const result = db.exec(`
      SELECT b.id as bookId, v.id as verseId, v.number
      FROM books b JOIN verses v ON v.book_id = b.id
      ORDER BY b.id, v.number
    `)

    const rows = result[0].values.map(([bookId, verseId, number]) => ({
      bookId: bookId as string,
      verseId: verseId as string,
      number: number as number
    }))

    const aggregated = rows.reduce<Record<string, { id: string; number: number }[]>>(
      (acc, row) => {
        acc[row.bookId] ||= []
        acc[row.bookId].push({ id: row.verseId, number: row.number })
        return acc
      },
      {}
    )

    expect(aggregated).toEqual({
      b1: [
        { id: 'v1', number: 1 },
        { id: 'v2', number: 2 }
      ],
      b2: [
        { id: 'v3', number: 1 },
        { id: 'v4', number: 2 }
      ]
    })
  })
})
