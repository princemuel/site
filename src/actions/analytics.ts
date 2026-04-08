import { z } from "astro/zod";
import { defineAction } from "astro:actions";

import { db } from "@/lib/db";

export const trackPageView = defineAction({
  input: z.object({
    page_url: z.string(),
    source_url: z.url(),
    title: z.string(),
  }),
  handler: async (body, { request, locals }) => {
    const user_agent = request.headers.get("user-agent");
    const { city, country, latitude, longitude } = locals.netlify.context.geo;
    const codePoints = (country?.code ?? "US").split("").map((c) => c.charCodeAt(0) + 127397);

    const session = await db.session.create({
      data: {
        city,
        flag: String.fromCodePoint(...codePoints),
        latitude,
        longitude,
        country: country?.name,
        user_agent,
        events: { create: { event: "PAGE_VIEW", slug: body.page_url } },
        ...body,
      },
    });

    return { session_id: session.id };
  },
});

export const trackPageExit = defineAction({
  handler: async (body) => {
    await db.session.update({
      data: {
        duration_human: body.duration_human,
        duration_ms: body.duration_ms,
        events: { create: { event: "PAGE_EXIT", slug: body.page_url } },
        interactions: body.interactions,
        session_end: Temporal.Now.instant().toString(),
      },
      where: { id: body.session_id },
    });

    return { success: true };
  },
  input: z.object({
    duration_human: z.string(),
    duration_ms: z.number().positive(),
    interactions: z.number().positive(),
    page_url: z.string(),
    session_id: z.string(),
  }),
});

export const trackEvent = defineAction({
  handler: async (body) => {
    await db.event.createMany({
      data: body.events.map((evt) => ({
        event: evt.event,
        metadata: evt.metadata,
        session_id: body.session_id,
        slug: body.page_url,
        timestamp: Temporal.Now.instant().toString(),
      })),
    });

    return { count: body.events.length, success: true };
  },
  input: z.object({
    events: z.array(
      z.object({
        event: z.enum(["CLICK", "KEYDOWN", "SCROLL"]),
        metadata: z.string().nullable(),
        timestamp: z.string(),
      })
    ),
    page_url: z.string(),
    session_id: z.string(),
  }),
});
