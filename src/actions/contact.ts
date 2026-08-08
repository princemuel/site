import { z } from "astro/zod";
import { ActionError, defineAction } from "astro:actions";
import { RESEND_ADDRESS, RESEND_EMAIL, RESEND_TOKEN } from "astro:env/server";
import { Resend } from "resend";

import { println$ } from "@/helpers/println";
import { capitalize } from "@/utils/strings";

const resend = new Resend(RESEND_TOKEN);

export default defineAction({
  accept: "form",
  input: z.object({
    subject_line: z.string().max(0).optional(),
    firstName: z.string("This field is required").max(32).trim(),
    lastName: z.string("This field is required").max(32).trim(),
    email: z.email("Please enter a valid email address").trim(),
    message: z.string("This field is required").min(20, "Message is too short").max(255).trim(),
    queryType: z.enum(
      ["general", "contract", "support", "issues"],
      "Please select a query type",
    ),
    consent: z.stringbool({
      message: "To submit this form, please consent to being contacted",
    }),
  }),
  handler: async (
    { firstName, lastName, email, subject_line, queryType, message },
    { locals },
  ) => {
    if (subject_line) return { success: true };
    if (locals.ratelimit.throttle) {
      throw new ActionError({
        code: "TOO_MANY_REQUESTS",
        message: "You have reached your request limit for today",
      });
    }

    const { data, error } = await resend.emails.send({
      from: `Portfolio Contact <${RESEND_ADDRESS}>`,
      to: RESEND_EMAIL,
      replyTo: email,
      subject: `${capitalize(queryType)} message from ${firstName} ${lastName}`,
      text: message,
      html: `
        <p><strong>From:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)} (${escapeHtml(email)})</p>
        <p><strong>Type:</strong> ${escapeHtml(capitalize(queryType))}</p>
        <p>${nl2br(escapeHtml(message))}</p>
      `,
    });

    if (error || !data) {
      println$("Resend error:", error);
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to send email. Please try again later.",
      });
    }

    return { success: true, message: `Email ${data.id} sent successfully` };
  },
});

function escapeHtml(str: string) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function nl2br(str: string) {
  return str.replaceAll("\n", "<br>");
}
