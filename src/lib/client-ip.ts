import type { APIContext } from "astro";

export function getClientIp(ctx: APIContext) {
  const { request } = ctx;

  const via = request.headers.get("Via") ?? "";
  const passedThroughFly = via.includes("fly.io");

  if (passedThroughFly) {
    const flyClientIp = request.headers.get("Fly-Client-IP");
    if (flyClientIp) return flyClientIp;
  }

  try {
    return ctx.clientAddress;
  } catch {
    // clientAddress throws if adapter doesn't support it (e.g. static/edge mismatch)
    return "global";
  }
}
