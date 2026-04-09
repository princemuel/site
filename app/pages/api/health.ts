import { db } from "@/lib/db";

import type { APIRoute } from "astro";

export const prerender = false;

const headers = { "Cache-Control": "no-cache, no-store, must-revalidate" };

export const GET: APIRoute = async () => {
  const timestamp = Temporal.Now.instant().epochMilliseconds;
  try {
    await db.$queryRaw`SELECT 1`;
    return Response.json({ ok: true, timestamp }, { headers, status: 200 });
  } catch {
    return Response.json({ ok: false, timestamp }, { headers, status: 503 });
  }
};
