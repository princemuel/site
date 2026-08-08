import type { APIRoute } from "astro";

import { humans as buffer } from "@/assets/include";
import { built } from "@/lib/build";
import { toSecs } from "@/utils/time";

export const GET: APIRoute = (ctx) => {
  const body = buffer
    .replaceAll("{{URL}}", new URL("hello", ctx.site).toString())
    .replaceAll("{{DATETIME}}", built.toPlainDate().toString())
    .trim();

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=UTF-8",
      "Cache-Control": `public, max-age=${toSecs({ days: 365 })}, immutable`,
    },
  });
};
