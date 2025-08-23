<<<<<<< HEAD
import { promises as fs } from "fs"
import path from "path"
import webpush from "web-push"
import { randomUUID } from "crypto"
import { eq } from "drizzle-orm"

import { db } from "./db"
import {
  notifications,
  notificationPreferences,
  notificationTypeEnum,
} from "./schema"

export type NotificationType =
  (typeof notificationTypeEnum.enumValues)[number]

export interface NotificationInput {
  userId: string
  actorId: string
  type: NotificationType
  commentId?: string
}

const DIGEST_FILE = path.join(process.cwd(), "data", "email-digest.json")

async function readDigest(): Promise<Record<string, any[]>> {
  try {
    const data = await fs.readFile(DIGEST_FILE, "utf8")
    return JSON.parse(data)
=======
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
>>>>>>> origin/codex/add-notifications-table-and-handlers
  } catch {
    return {}
  }
}

<<<<<<< HEAD
async function writeDigest(data: Record<string, any[]>) {
  await fs.mkdir(path.dirname(DIGEST_FILE), { recursive: true })
  await fs.writeFile(DIGEST_FILE, JSON.stringify(data, null, 2))
}

export async function createNotification(input: NotificationInput) {
  const [notification] = await db
    .insert(notifications)
    .values({
      id: randomUUID(),
      userId: input.userId,
      actorId: input.actorId,
      type: input.type,
      commentId: input.commentId,
    })
    .returning()

=======
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
>>>>>>> origin/codex/add-notifications-table-and-handlers
  await deliverNotification(notification)
  return notification
}

<<<<<<< HEAD
export async function getNotifications(userId: string) {
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
}

async function deliverNotification(notification: any) {
  const pref = await db.query.notificationPreferences.findFirst({
    where: eq(notificationPreferences.userId, notification.userId),
  })

  if (!pref) return

  if (pref.push && pref.pushEndpoint) {
    try {
      await webpush.sendNotification(
        JSON.parse(pref.pushEndpoint),
        JSON.stringify(notification)
      )
    } catch (err) {
      console.error("push failed", err)
    }
  }

  if (pref.email) {
    const digest = await readDigest()
    if (!digest[notification.userId]) digest[notification.userId] = []
    digest[notification.userId].push(notification)
    await writeDigest(digest)
  }
}

export async function sendEmailDigests() {
  const digest = await readDigest()
  for (const userId of Object.keys(digest)) {
    const items = digest[userId]
    if (!items.length) continue
    // placeholder for actual email sending
    console.log(`Email digest for ${userId}:`, items.length)
  }
  await writeDigest({})
}

=======
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
>>>>>>> origin/codex/add-notifications-table-and-handlers
