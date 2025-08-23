export interface VerseTranslation {
  book: string;
  translator: string;
  verseNumber: number;
  text: string;
}

export type ExportFormat = 'json' | 'html';

export function exportVerses(
  verses: VerseTranslation[],
  format: ExportFormat = 'json'
): string {
  if (format === 'html') {
    const body = verses
      .map(
        (v) =>
          `<div><h3>${v.book} - ${v.translator} - Verse ${v.verseNumber}</h3><p>${v.text}</p></div>`
      )
      .join('\n');
    return `<!DOCTYPE html><html><body>${body}</body></html>`;
  }
  return JSON.stringify(verses, null, 2);
}
