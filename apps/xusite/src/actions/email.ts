import { ActionError, defineAction } from "astro:actions";

import { z } from "astro/zod";

export default defineAction({
  input: z.object({ name: z.string() }),
  handler: (body, { locals }) => {
    if (locals.ratelimit.throttle) {
      throw new ActionError({
        code: "TOO_MANY_REQUESTS",
        message: "You have reached your request limit for today",
      });
    }

    return `Hello, ${body.name}!`;
  },
});
