import { pubkey as buffer } from "@/assets/include";
import { secs } from "@/utils";

export const GET = () =>
  new Response(buffer, {
    status: 200,
    headers: {
      "Cache-Control": `public, max-age=${secs({ days: 28 })}, immutable`,
      "Content-Type": "application/pgp-keys",
      "Content-Disposition": 'inline; filename="pubkey.asc"',
      "X-Content-Type-Options": "nosniff",
    },
  });
