import { RATE_LIMIT_WINDOW } from "astro:env/server";
import { eq, lt } from "drizzle-orm";

import { db } from "@/db/client";
import { ratelimits } from "@/db/schema/ratelimits";
import { parseDuration } from "@/utils/time";

interface RateLimitOptions {
  limit?: number;
  window?: Temporal.Duration;
}

const inFlight = new Map<string, Promise<RateLimitResult>>();
const LIMIT_WINDOW = parseDuration(RATE_LIMIT_WINDOW ?? "60 s");

export function checkRateLimit(
  key: string,
  { limit = 5, window = LIMIT_WINDOW }: RateLimitOptions = {},
): Promise<RateLimitResult> {
  return inFlight.getOrInsertComputed(key, async () => {
    try {
      return await computeRateLimit(key, limit, window);
    } finally {
      inFlight.delete(key);
    }
  });
}

async function computeRateLimit(
  key: string,
  limit: number,
  window: Temporal.Duration,
): Promise<RateLimitResult> {
  const now = Temporal.Now.instant();

  const rows = await db.select().from(ratelimits).where(eq(ratelimits.key, key)).limit(1);
  const [existing] = rows;

  if (!existing || Temporal.Instant.compare(existing.reset_at, now) < 0) {
    const reset_at = now.add(window);

    await db
      .insert(ratelimits)
      .values({ key, count: 1, reset_at })
      .onConflictDoUpdate({ target: ratelimits.key, set: { count: 1, reset_at } });

    if (Math.random() < 0.02) void db.delete(ratelimits).where(lt(ratelimits.reset_at, now));

    return { limit, remaining: limit - 1, reset: reset_at, throttle: false };
  }

  const count = existing.count + 1;
  await db.update(ratelimits).set({ count }).where(eq(ratelimits.key, key));

  return {
    limit,
    remaining: Math.max(0, limit - count),
    reset: existing.reset_at,
    throttle: count > limit,
  };
}
