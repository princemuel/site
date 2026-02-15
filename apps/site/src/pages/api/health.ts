// SPDX-License-Identifier: Apache-2.0
import { db } from "xusqldb";

import { getErrorMessage } from "@/helpers/error";

import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async () => {
  const timestamp = Temporal.Now.instant().toString();
  try {
    await db.$queryRaw`SELECT 1`;
    return Response.json(
      { database: "connected", status: "healthy", timestamp },
      { headers: { "Cache-Control": "no-cache, no-store, must-revalidate" }, status: 200 },
    );
  } catch (error) {
    return Response.json(
      { database: "disconnected", error: getErrorMessage(error), status: "unhealthy", timestamp },
      { headers: { "Cache-Control": "no-cache, no-store, must-revalidate" }, status: 503 },
    );
  }
};
