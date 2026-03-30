import { secs } from "@repo/utils";

// SPDX-License-Identifier: Apache-2.0
export const GET = async () => {
  return new Response(null, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": `public,max-age=${secs({ seconds: 0 })},must-revalidate,stale-while-revalidate=${secs({ seconds: 3600 })}`,
    },
  });
};
