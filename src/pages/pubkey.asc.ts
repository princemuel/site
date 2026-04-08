import { pubkey as buffer } from "@/assets/include";
import { secs } from "@/utils";

import type { APIRoute } from "astro";

export const GET: APIRoute = () =>
  new Response(buffer, {
    status: 200,
    headers: {
      "Cache-Control": `public, max-age=${secs({ days: 365 })}, immutable`,
      "Content-Type": "application/pgp-keys",
      "Content-Disposition": 'inline; filename="pubkey.asc"',
      "X-Content-Type-Options": "nosniff",
    },
  });
