import resource from "@/assets/include/robots.txt?raw";

import type { APIRoute } from "astro";

export const GET: APIRoute = async (ctx) => {
  const body = resource
    .replaceAll("{{URL}}", new URL("sitemap-index.xml", ctx.site).toString())
    .trim();
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=UTF-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
