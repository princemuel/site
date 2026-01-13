// SPDX-License-Identifier: Apache-2.0
import { opensearch as buffer } from "@/assets/include";
import { secs } from "@/utils/time";

import type { APIRoute } from "astro";

export const GET: APIRoute = async (ctx) => {
  const body = buffer.replaceAll("{{URL}}", new URL("/", ctx.site).toString()).trim();
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/opensearchdescription+xml; charset=UTF-8",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": `public, max-age=${secs({ d: 365 })}, immutable`,
    },
  });
};
