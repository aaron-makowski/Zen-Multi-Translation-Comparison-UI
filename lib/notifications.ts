import { promises as fs } from 'fs'
import path from 'path'

export type NotificationType = 'reply' | 'mention'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  data?: string
  read: boolean
  createdAt: string
}

const NOTIFICATIONS_FILE = path.join(process.cwd(), 'data', 'notifications.json')
const PREFS_FILE = path.join(process.cwd(), 'data', 'preferences.json')

async function readNotifications(): Promise<Notification[]> {
  try {
    const json = await fs.readFile(NOTIFICATIONS_FILE, 'utf8')
    return JSON.parse(json || '[]')
  } catch {
    return []
  }
}

async function writeNotifications(notifs: Notification[]) {
  await fs.mkdir(path.dirname(NOTIFICATIONS_FILE), { recursive: true })
  await fs.writeFile(NOTIFICATIONS_FILE, JSON.stringify(notifs, null, 2))
}

interface UserPreferences {
  email?: string
  emailNotifications?: boolean
  pushEndpoint?: string
  pushNotifications?: boolean
}

async function getPreferences(userId: string): Promise<UserPreferences> {
  try {
    const json = await fs.readFile(PREFS_FILE, 'utf8')
    const prefs = JSON.parse(json || '{}')
    return prefs[userId] || {}
  } catch {
    return {}
  }
}

export async function addNotification(input: {
  userId: string
  type: NotificationType
  data?: string
}) {
  const notifs = await readNotifications()
  const notification: Notification = {
    id: crypto.randomUUID(),
    userId: input.userId,
    type: input.type,
    data: input.data,
    read: false,
    createdAt: new Date().toISOString(),
  }
  notifs.push(notification)
  await writeNotifications(notifs)
  await deliverNotification(notification)
  return notification
}

export async function getNotificationsForUser(userId: string) {
  const notifs = await readNotifications()
  return notifs.filter((n) => n.userId === userId)
}

export async function markAllRead(userId: string) {
  const notifs = await readNotifications()
  let changed = false
  for (const n of notifs) {
    if (n.userId === userId) {
      n.read = true
      changed = true
    }
  }
  if (changed) await writeNotifications(notifs)
}

async function deliverNotification(notification: Notification) {
  const prefs = await getPreferences(notification.userId)
  if (prefs.email && prefs.emailNotifications) {
    await sendEmailDigest(prefs.email, [notification])
  }
  if (prefs.pushEndpoint && prefs.pushNotifications) {
    await sendPushNotification(prefs.pushEndpoint, notification)
  }
}

export async function sendEmailDigest(
  email: string,
  notifications: Notification[]
) {
  // Placeholder for real email implementation
  console.log(`Email to ${email}`, notifications.map((n) => n.type))
}

export async function sendPushNotification(
  endpoint: string,
  notification: Notification
) {
  // Placeholder for real push implementation
  console.log(`Push to ${endpoint}`, notification.type)
}
