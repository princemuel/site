import { ActionError, defineAction } from "astro:actions";
import { RESEND_AUDIENCE } from "astro:env/server";

import { z } from "astro/zod";

import { resend } from "@/lib/api";

export default defineAction({
  accept: "form",
  handler: async (body, { locals }) => {
    // oxlint-disable-next-line strict-boolean-expressions
    if (body.honeypot) {
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
  input: z.object({
    email: z
      .string({ message: "This field is required" })
      .min(1, { message: "This field is required" })
      .email({ message: "Please enter a valid email address" }),
    honeypot: z.string().max(0, "Invalid submission detected.").optional(),
  }),
});
