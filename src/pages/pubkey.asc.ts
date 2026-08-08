import { pubkey as buffer } from "@/assets/include";
import { toSecs } from "@/utils/time";

export const GET = () =>
  new Response(buffer, {
    status: 200,
    headers: {
      "Cache-Control": `public, max-age=${toSecs({ days: 28 })}, immutable`,
      "Content-Type": "application/pgp-keys",
      "Content-Disposition": 'inline; filename="pubkey.asc"',
      "X-Content-Type-Options": "nosniff",
    },
  });
