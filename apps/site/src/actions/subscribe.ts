import { ActionError, defineAction } from "astro:actions";
import { RESEND_AUDIENCE } from "astro:env/server";

import { z } from "astro/zod";

import { resend } from "@/lib/api";

export default defineAction({
  accept: "form",
  input: z.object({
    email: z.email("Please enter a valid email address"),
    fruity: z.literal("").optional(),
  }),
  handler: async (body, { locals }) => {
    // oxlint-disable-next-line strict-boolean-expressions
    if (body.fruity) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "Invalid submission detected.",
      });
    }

    if (locals.ratelimit.throttle) {
      throw new ActionError({
        code: "TOO_MANY_REQUESTS",
        message: "You have reached your request limit for today",
      });
    }

    const { error, data } = await resend.contacts.create({
      audienceId: RESEND_AUDIENCE,
      email: body.email,
      unsubscribed: false,
    });

    if (error) throw new ActionError({ code: "BAD_REQUEST", message: error.message });
    return data;
  },
});
