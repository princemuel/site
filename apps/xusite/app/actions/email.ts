import { ActionError, defineAction } from "astro:actions";

import { z } from "astro/zod";

export default defineAction({
  handler: (body, { locals }) => {
    if (locals.ratelimit.throttle) {
      throw new ActionError({
        code: "TOO_MANY_REQUESTS",
        message: "You have reached your request limit for today",
      });
    }

    return `Hello, ${body.name}!`;
  },
  input: z.object({ name: z.string() }),
});
