import "server-only";

/**
 * Minimal fixed-window rate limiter.
 *
 * Guards the endpoints an unauthenticated or low-cost caller can hammer:
 * magic-link requests (email bombing / account enumeration by timing) and
 * message sends (storage exhaustion). Keeping it in-process means no extra
 * infrastructure, at the cost of being per-instance.
 *
 * LIMITATION: counters live in memory, so a multi-instance deployment gives
 * each instance its own budget, and a restart clears them. That is acceptable
 * as a speed bump in front of Supabase's own server-side limits, but for a
 * hard guarantee this needs a shared store (Redis / Postgres).
 */
type Window = { count: number; resetAt: number };

const buckets = new Map<string, Window>();
const MAX_KEYS = 10_000;

function sweep(now: number): void {
  for (const [key, win] of buckets) {
    if (win.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult = { allowed: boolean; retryAfterSeconds: number };

/**
 * @param key    Caller identity — an auth user id, or a hashed address.
 * @param limit  Requests permitted per window.
 * @param windowMs Window length in milliseconds.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();

  // Bound memory: an attacker cycling keys must not grow the map without end.
  if (buckets.size > MAX_KEYS) sweep(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
