import { redis } from './redis'

const WINDOW_SECONDS = 60
const MAX_REQUESTS = 5

const memory = new Map<string, { count: number; expires: number }>()

export async function rateLimit(identifier: string): Promise<boolean> {
  if (redis) {
    const count = await redis.incr(identifier)
    if (count === 1) {
      await redis.expire(identifier, WINDOW_SECONDS)
    }
    return count > MAX_REQUESTS
  }

  const now = Date.now()
  const record = memory.get(identifier) || { count: 0, expires: now + WINDOW_SECONDS * 1000 }
  if (record.expires < now) {
    record.count = 0
    record.expires = now + WINDOW_SECONDS * 1000
  }
  record.count += 1
  memory.set(identifier, record)
  return record.count > MAX_REQUESTS
}
