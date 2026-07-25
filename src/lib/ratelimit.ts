import {
  RATE_LIMIT_TOKENS,
  RATE_LIMIT_WINDOW,
  UPSTASH_REDIS_REST_TOKEN,
  UPSTASH_REDIS_REST_URL,
} from "astro:env/server";

type Duration = Parameters<typeof Ratelimit.slidingWindow>[1];

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const ratelimit = new Ratelimit({
  redis: new Redis({ url: UPSTASH_REDIS_REST_URL, token: UPSTASH_REDIS_REST_TOKEN }),
  limiter: Ratelimit.slidingWindow(RATE_LIMIT_TOKENS, RATE_LIMIT_WINDOW as Duration),
  ephemeralCache: new Map(),
  prefix: "@upstash/ratelimit",
  analytics: true,
});
