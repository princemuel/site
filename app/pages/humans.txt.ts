import { humans as data } from "@/assets/include";

import type { APIRoute } from "astro";

export const GET: APIRoute = async (ctx) => {
  const body = data
    .replaceAll("{{URL}}", new URL("hello", ctx.site).toString())
    .replaceAll(
      "{{DATETIME}}",
      new Intl.DateTimeFormat("en-CA").format(new Date()).replaceAll("-", "/"),
    )
    .trim();
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=UTF-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
