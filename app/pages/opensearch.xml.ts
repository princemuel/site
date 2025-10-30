import { opensearch as data } from "@/assets/include";

import type { APIRoute } from "astro";

export const GET: APIRoute = async (ctx) => {
  const body = data.replaceAll("{{URL}}", new URL("/", ctx.site).toString()).trim();
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/opensearchdescription+xml; charset=UTF-8",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
