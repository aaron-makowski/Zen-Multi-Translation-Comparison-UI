import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderToString } from 'react-dom/server';

;(globalThis as any).React = React;

const { booksFindMany, versesFindMany } = vi.hoisted(() => ({
  booksFindMany: vi.fn(),
  versesFindMany: vi.fn(),
}));

vi.mock('@radix-ui/react-slot', () => ({
  Slot: ({ children }: any) => <>{children}</>,
}));

vi.mock('@/lib/db', () => ({
  db: {
    query: {
      books: { findMany: booksFindMany },
      verses: { findMany: versesFindMany },
    },
  },
}));

vi.mock('@/lib/schema', () => ({ verses: {} }));

import MultiComparePage from './page';

const booksData = [
  {
    id: 'book1',
    title: 'Book One',
    verses: [{ id: 'v1', number: 1 }],
  },
  {
    id: 'book2',
    title: 'Book Two',
    verses: [{ id: 'v2', number: 2 }],
  },
];

describe('MultiComparePage', () => {
  beforeEach(() => {
    booksFindMany.mockResolvedValue(booksData);
    booksFindMany.mockClear();
    versesFindMany.mockClear();
  });

  it('displays translations for selected verses', async () => {
    versesFindMany.mockResolvedValue([
      {
        id: 'v1',
        number: 1,
        bookId: 'book1',
        book: { id: 'book1', title: 'Book One' },
        translations: [
          { id: 't1', translator: 'Alice', text: 'Text 1' },
        ],
      },
      {
        id: 'v2',
        number: 2,
        bookId: 'book2',
        book: { id: 'book2', title: 'Book Two' },
        translations: [
          { id: 't2', translator: 'Bob', text: 'Text 2' },
        ],
      },
    ]);

    const jsx = await MultiComparePage({ searchParams: { ids: 'v1,v2' } });
    const html = renderToString(jsx);

    expect(html).toContain('Book One<!-- --> - Verse <!-- -->1');
    expect(html).toContain('Alice');
    expect(html).toContain('Text 1');
    expect(html).toContain('Book Two<!-- --> - Verse <!-- -->2');
    expect(html).toContain('Bob');
    expect(html).toContain('Text 2');
  });

  it('handles empty selection', async () => {
    const jsx = await MultiComparePage({ searchParams: {} });
    const html = renderToString(jsx);

    expect(versesFindMany).not.toHaveBeenCalled();
    expect(html).not.toContain('Book One<!-- --> - Verse <!-- -->1');
    expect(html).not.toContain('Book Two<!-- --> - Verse <!-- -->2');
  });

  it('handles invalid ids', async () => {
    versesFindMany.mockResolvedValue([]);

    const jsx = await MultiComparePage({ searchParams: { ids: 'bad' } });
    const html = renderToString(jsx);

    expect(versesFindMany).toHaveBeenCalled();
    expect(html).not.toContain('Book One<!-- --> - Verse <!-- -->1');
    expect(html).not.toContain('Book Two<!-- --> - Verse <!-- -->2');
  });
});

