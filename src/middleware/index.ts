import { RATE_LIMIT_TOKEN, RATE_LIMIT_WINDOW } from "astro:env/server";
import { defineMiddleware } from "astro:middleware";

import { checkRateLimit } from "@/lib/ratelimit";
import { parseDuration } from "@/utils/time";

export const onRequest = defineMiddleware(async (ctx, next) => {
  const { request, clientAddress, locals } = ctx;
  const shouldLimit = request.method === "POST" || ctx.url.pathname.startsWith("/_actions");

  if (!shouldLimit) return next();

  const result = await checkRateLimit(clientAddress, {
    limit: RATE_LIMIT_TOKEN,
    window: parseDuration(RATE_LIMIT_WINDOW),
  });

  locals.ratelimit = {
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset.epochMilliseconds,
    throttle: result.throttle,
  };

  if (!result.throttle) return next();

  const retryAfter = Temporal.Now.instant().until(result.reset).total("seconds");

  return new Response("Too many requests. Please try again shortly.", {
    status: 429,
    headers: {
      "Retry-After": String(Math.max(0, Math.ceil(retryAfter))),
      "X-RateLimit-Limit": String(result.limit),
      "X-RateLimit-Remaining": String(result.remaining),
    },
  });
});
