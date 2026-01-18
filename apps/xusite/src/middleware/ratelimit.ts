import { UPSTASH_LIMIT_WINDOW } from "astro:env/server";

import { println$ } from "@/helpers/println";
import { ratelimiter } from "@/lib/cache";
import { hash } from "xuutils";

import type { MiddlewareHandler } from "astro";

export const ratelimit: MiddlewareHandler = async (ctx, next) => {
  if (!ctx.request.url.includes("/api/")) return next();

  if (ctx.isPrerendered) return next();

  try {
    const ip = import.meta.env.DEV
      ? "anonymous"
      : (ctx.locals.netlify.context.ip ??
        ctx.clientAddress ??
        ctx.request.headers.get("x-forwarded-for") ??
        ctx.request.headers.get("x-real-ip"));

    if (!ip) {
      println$("[ratelimit] No IP address found for rate limiting");
      return new Response("Rate limit configuration error", { status: 500 });
    }

    const { success, limit, remaining, reset } = await ratelimiter.limit(hash(ip));
    ctx.locals.ratelimit = { limit, remaining, reset, throttle: !success };

    if (!success) {
      return new Response("Rate limit exceeded. Try again later.", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
          "Retry-After": UPSTASH_LIMIT_WINDOW.toString(),
        },
      });
    }

    const result = await next();
    const response = new Response(result.body, {
      status: result.status,
      statusText: result.statusText,
      headers: new Headers(result.headers),
    });

    response.headers.set("X-RateLimit-Limit", limit.toString());
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    response.headers.set("X-RateLimit-Reset", reset.toString());
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    println$(`[ratelimit] Middleware error: ${message}`);
    return new Response("Internal server error", { status: 500 });
  }
};
