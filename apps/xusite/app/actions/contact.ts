import { z } from "astro/zod";
import { ActionError, defineAction } from "astro:actions";
import { RESEND_ADDRESS } from "astro:env/server";

import { resend } from "@/lib/api";
import { capitalize } from "xuutils";

export default defineAction({
  accept: "form",
  input: z.object({
    honeypot: z.string().max(0, "Invalid submission detected.").optional(),
    firstName: z
      .string({ message: "This field is required" })
      .min(1, { message: "This field is required" })
      .max(32)
      .trim(),
    lastName: z
      .string({ message: "This field is required" })
      .min(1, { message: "This field is required" })
      .max(32)
      .trim(),
    email: z
      .string({ message: "This field is required" })
      .min(1, { message: "This field is required" })
      .email({ message: "Please enter a valid email address" })
      .trim(),
    message: z
      .string({ message: "This field is required" })
      .min(1, { message: "This field is required" })
      .min(20, { message: "Message must be up to 20 chars" })
      .max(255)
      .trim(),
    queryType: z.enum(["general", "contract", "support", "issues"], {
      message: "Please select a query type",
    }),
    consent: z
      .string({ message: "To submit this form, please consent to being contacted" })
      .refine((value) => value === "on", {
        message: "To submit this form, please consent to being contacted",
      }),
  }),
  handler: async (body, { locals }) => {
    if (body.honeypot) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "Invalid submission detected.",
      });
    }

    if (locals?.ratelimit?.throttle) {
      throw new ActionError({
        code: "TOO_MANY_REQUESTS",
        message: "You have reached your request limit for today",
      });
    }

    const { data, error } = await resend.emails.send({
      from: `${body.firstName} <${RESEND_ADDRESS}>`,
      to: [RESEND_ADDRESS],
      subject: `${capitalize(body.queryType)} email from ${body.firstName} ${body.lastName}`,
      text: body.message,
      replyTo: [RESEND_ADDRESS],
    });

    if (error) throw new ActionError({ code: "BAD_REQUEST", message: error.message });
    return data;
  },
});
