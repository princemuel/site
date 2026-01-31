// SPDX-License-Identifier: Apache-2.0
import { robots as buffer } from "@/assets/include";
import { secs } from "@core/utils";

import type { APIRoute } from "astro";

export const GET: APIRoute = (ctx) => {
  const body = buffer
    .replaceAll("{{URL}}", new URL("sitemap-index.xml", ctx.site).toString())
    .trim();
  return new Response(body, {
    headers: {
      "Cache-Control": `public, max-age=${secs({ d: 365 })}, immutable`,
      "Content-Type": "text/plain; charset=UTF-8",
    },
    status: 200,
  });
};
