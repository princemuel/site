// SPDX-License-Identifier: Apache-2.0
import { db } from "@repo/db";

import type { APIRoute } from "astro";

export const prerender = false;

const HEADERS = { "Cache-Control": "no-cache, no-store, must-revalidate" };

export const GET: APIRoute = async () => {
  const ts = Temporal.Now.instant().epochMilliseconds;
  try {
    await db.$queryRaw`SELECT 1`;
    return Response.json({ ok: true, ts }, { headers: HEADERS, status: 200 });
  } catch {
    return Response.json({ ok: false, ts }, { headers: HEADERS, status: 503 });
  }
};
