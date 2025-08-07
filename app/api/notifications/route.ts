import { NextResponse } from 'next/server'
import { getNotificationsForUser, markAllRead } from '../../../lib/notifications'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }
  const notifications = await getNotificationsForUser(userId)
  return NextResponse.json(notifications)
}

export async function POST(req: Request) {
  const { userId } = await req.json()
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }
  await markAllRead(userId)
  return NextResponse.json({ ok: true })
}
