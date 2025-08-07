import { db } from "./db"
import { notifications, users, type NotificationType } from "./schema"
import { eq } from "drizzle-orm"

async function sendEmail(email: string, content: string) {
  console.log(`Email to ${email}: ${content}`)
}

async function sendPush(userId: string, content: string) {
  console.log(`Push to ${userId}: ${content}`)
}

export async function createNotification(
  userId: string,
  type: NotificationType,
  content: string
) {
  await db.insert(notifications).values({
    id: crypto.randomUUID(),
    userId,
    type,
    content,
  })
  const [user] = await db.select().from(users).where(eq(users.id, userId))
  if (user) {
    if (user.emailNotifications) await sendEmail(user.email, content)
    if (user.pushNotifications) await sendPush(userId, content)
  }
}
