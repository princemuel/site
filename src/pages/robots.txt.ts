import type { APIRoute } from "astro";

import { robots as buffer } from "@/assets/include";
import { toSeconds } from "@/utils/time";

export const GET: APIRoute = (ctx) => {
  const body = buffer
    .replaceAll("{{URL}}", new URL("sitemap-index.xml", ctx.site).toString())
    .trim();
  return new Response(body, {
    status: 200,
    headers: {
      "Cache-Control": `public, max-age=${toSeconds({ days: 365 })}, immutable`,
      "Content-Type": "text/plain; charset=UTF-8",
    },
  });
};
