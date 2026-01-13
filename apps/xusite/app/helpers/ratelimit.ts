import { invariant } from "outvariant";

import { ratelimiter } from "@/lib/cache";
import { hash } from "@/utils/hash";

export const isRateLimited = async (request: Request) => {
  const ip = import.meta.env.DEV
    ? "anonymous"
    : (request.headers.get("x-nf-client-connection-ip") ?? request.headers.get("x-forwarded-for"));

  invariant(ip, "No rate limiting header found for this address!");

  const { success, limit, remaining, reset } = await ratelimiter.limit(hash(ip));

  return { limit, remaining, reset, throttle: !success };
};
// import { ratelimiter } from "@/lib/cache";
// import { hash } from "@/utils/hash";

// export const isRateLimited = async (request: Request) => {
//   const ip =
//     request.headers.get("x-nf-client-connection-ip") ?? request.headers.get("x-forwarded-for");

//   const { success, limit, remaining, reset } = await ratelimiter.limit(hash(ip ?? "anonymous"));

//   return { limit, remaining, reset, throttle: !success };
// };
