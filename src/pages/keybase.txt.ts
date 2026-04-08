import { keybase as buffer } from "@/assets/include";
import { secs } from "@/utils";

import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  return new Response(buffer, {
    status: 200,
    headers: {
      "Cache-Control": `public, max-age=${secs({ days: 1 })}, immutable`,
      "Content-Type": "text/plain; charset=UTF-8",
    },
  });
};
