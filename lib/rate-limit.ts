import { NextRequest } from "next/server"

interface RateLimitOptions {
  windowMs: number
  max: number
  keyGenerator?: (req: NextRequest) => string
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

// In-memory store for rate limiting
// In production, use Redis or another persistent store
const store: RateLimitStore = {}

export function rateLimit(options: RateLimitOptions) {
  const { windowMs, max, keyGenerator } = options

  return async (req: NextRequest): Promise<{ success: boolean; limit: number; remaining: number; resetTime: number }> => {
    const key = keyGenerator ? keyGenerator(req) : getDefaultKey(req)
    const now = Date.now()
    const windowStart = now - windowMs

    // Clean up expired entries
    Object.keys(store).forEach(k => {
      if (store[k].resetTime < now) {
        delete store[k]
      }
    })

    // Get or create entry for this key
    if (!store[key] || store[key].resetTime < now) {
      store[key] = {
        count: 0,
        resetTime: now + windowMs,
      }
    }

    // Increment count
    store[key].count++

    const limit = max
    const remaining = Math.max(0, limit - store[key].count)
    const success = store[key].count <= limit

    return {
      success,
      limit,
      remaining,
      resetTime: store[key].resetTime,
    }
  }
}

function getDefaultKey(req: NextRequest): string {
  // Use IP address as default key
  const forwarded = req.headers.get("x-forwarded-for")
  const ip = forwarded ? forwarded.split(",")[0] : req.ip || "unknown"
  return `rate_limit:${ip}`
}

export function createRateLimitHeaders(limit: number, remaining: number, resetTime: number) {
  return {
    "X-RateLimit-Limit": limit.toString(),
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": new Date(resetTime).toISOString(),
  }
}
