import type { APIRoute } from "astro";

import { keybase as buffer } from "../../assets/include";
import { toSeconds } from "../../utils/time";

export const GET: APIRoute = () =>
  new Response(buffer, {
    status: 200,
    headers: {
      "Cache-Control": `public, max-age=${toSeconds({ days: 1 })}, immutable`,
      "Content-Type": "text/plain; charset=UTF-8",
    },
  });
