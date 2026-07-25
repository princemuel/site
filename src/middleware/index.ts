import { getClientIp } from "@/lib/client-ip";
import { ratelimit } from "@/lib/ratelimit";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (ctx, next) => {
  if (ctx.isPrerendered) return next();

  const shouldLimit = ctx.request.method === "POST" || ctx.url.pathname.startsWith("/_actions");
  if (!shouldLimit) return next();

  const ip = getClientIp(ctx);
  const result = await ratelimit.limit(ip);

  ctx.locals.ratelimit = {
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
    throttle: !result.success,
  };

  if (result.success) return next();

  const reset = Temporal.Instant.fromEpochMilliseconds(result.reset);
  const retryAfter = Temporal.Now.instant().until(reset).total("seconds");

  return new Response("Too many requests. Please try again shortly.", {
    status: 429,
    headers: {
      "Retry-After": Math.max(0, Math.ceil(retryAfter)).toString(),
      "X-RateLimit-Limit": result.limit.toString(),
      "X-RateLimit-Remaining": result.remaining.toString(),
      "X-RateLimit-Success": result.success.toString(),
    },
  });
});
