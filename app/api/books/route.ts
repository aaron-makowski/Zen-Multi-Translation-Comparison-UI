import { prisma } from '../../../lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const list = await prisma.book.findMany()
  return NextResponse.json(list)
}
