import type { APIRoute } from "astro";

import { opensearch as buffer } from "@/assets/include";
import { toSecs } from "@/utils/time";

export const GET: APIRoute = (ctx) => {
  const body = buffer.replaceAll("{{URL}}", new URL("/", ctx.site).toString()).trim();
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/opensearchdescription+xml; charset=UTF-8",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": `public, max-age=${toSecs({ days: 365 })}, immutable`,
    },
  });
};
