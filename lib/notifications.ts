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
  } catch {
    return {}
  }
}

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

  await deliverNotification(notification)
  return notification
}

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

