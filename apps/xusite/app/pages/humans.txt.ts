// SPDX-License-Identifier: Apache-2.0
import { humans as buffer } from "@/assets/include";
import { secs } from "@/utils/time";

import type { APIRoute } from "astro";

export const GET: APIRoute = async (ctx) => {
  const body = buffer
    .replaceAll("{{URL}}", new URL("hello", ctx.site).toString())
    .replaceAll("{{DATETIME}}", new Intl.DateTimeFormat("en-CA").format(new Date()).replaceAll("-", "."))
    .trim();
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=UTF-8",
      "Cache-Control": `public, max-age=${secs({ d: 365 })}, immutable`,
    },
  });
};
