import { Redis } from "@upstash/redis"

const redisUrl = process.env.UPSTASH_REDIS_REST_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN

// Fallback to in-memory store if env vars are missing
let redis: any

if (redisUrl && redisToken) {
  redis = new Redis({
    url: redisUrl,
    token: redisToken,
  })
} else {
  const store = new Map<string, any>()
  redis = {
    get: async (key: string) => store.get(key),
    set: async (key: string, value: any, _options?: { ex?: number }) => {
      store.set(key, value)
    },
    del: async (key: string) => {
      store.delete(key)
    },
  }
}

export { redis }
