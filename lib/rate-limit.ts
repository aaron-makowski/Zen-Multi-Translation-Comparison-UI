import { redis } from './redis'

const localCache = new Map<string, { count: number; timestamp: number }>()

export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> {
  if (redis) {
    const count = await redis.incr(key)
    if (count === 1) {
      await redis.expire(key, windowSeconds)
    }
    return count <= limit
  }

  const now = Date.now()
  const record = localCache.get(key) || { count: 0, timestamp: now }
  if (now - record.timestamp > windowSeconds * 1000) {
    record.count = 0
    record.timestamp = now
  }
  record.count += 1
  localCache.set(key, record)
  return record.count <= limit
}
