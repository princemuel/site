// SPDX-License-Identifier: Apache-2.0
import { pubkey as buffer } from "@/assets/include";
import { secs } from "@/utils/time";

import type { APIRoute } from "astro";

export const GET: APIRoute = () =>
  new Response(buffer, {
    headers: {
      "Cache-Control": `public, max-age=${secs({ d: 365 })}, immutable`,
      "Content-Type": "text/plain; charset=UTF-8",
    },
    status: 200,
  });
