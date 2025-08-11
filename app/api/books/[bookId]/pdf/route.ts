import { prisma } from '../../../../../lib/db'
import { NextResponse } from 'next/server'

export async function GET(_req: Request, { params }: { params: { bookId: string } }) {
  const verses = await prisma.verse.findMany({
    where: { bookId: params.bookId },
    orderBy: { number: 'asc' },
  })
  const content = verses.map(v => `Verse ${v.number}`).join('\n')
  return new NextResponse(content, {
    headers: { 'content-type': 'application/pdf' }
  })
}
