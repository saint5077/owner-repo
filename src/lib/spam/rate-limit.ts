import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

/**
 * Rate-Limit pro IP. Mit `UPSTASH_REDIS_REST_URL`/`_TOKEN` gesetzt: echtes Upstash-Redis
 * (Produktion). Ohne (Standard in der Entwicklung, Briefing §7/§9): einfacher In-Memory-Zähler
 * pro Serverprozess — für lokale Entwicklung ausreichend, nicht für mehrere Serverless-Instanzen
 * gedacht (dort übernimmt Upstash).
 */
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5

const memoryStore = new Map<string, { count: number; resetAt: number }>()

function memoryLimit(key: string): { success: boolean; remaining: number } {
  const now = Date.now()
  const entry = memoryStore.get(key)
  if (!entry || entry.resetAt < now) {
    memoryStore.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return { success: true, remaining: MAX_PER_WINDOW - 1 }
  }
  entry.count += 1
  const success = entry.count <= MAX_PER_WINDOW
  return { success, remaining: Math.max(0, MAX_PER_WINDOW - entry.count) }
}

let upstashLimiter: Ratelimit | null = null
function getUpstashLimiter(): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  if (!upstashLimiter) {
    upstashLimiter = new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(MAX_PER_WINDOW, '60 s'),
      prefix: 'nora-ratelimit',
    })
  }
  return upstashLimiter
}

export async function checkRateLimit(ip: string, formType: string): Promise<{ success: boolean }> {
  const key = `${formType}:${ip}`
  const upstash = getUpstashLimiter()
  if (upstash) {
    const { success } = await upstash.limit(key)
    return { success }
  }
  return memoryLimit(key)
}
