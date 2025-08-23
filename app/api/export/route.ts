import { NextRequest, NextResponse } from 'next/server'
import { exportVerses, VerseTranslation, ExportFormat } from '@/lib/export'

export async function POST(req: NextRequest) {
  const { verses, format }: { verses: VerseTranslation[]; format?: ExportFormat } =
    await req.json()

  const fmt = format ?? 'json'
  const output = exportVerses(verses, fmt)
  const type = fmt === 'html' ? 'text/html' : 'application/json'
  const ext = fmt === 'html' ? 'html' : 'json'

  return new NextResponse(output, {
    headers: {
      'Content-Type': type,
      'Content-Disposition': `attachment; filename="verses.${ext}"`,
    },
  })
}
