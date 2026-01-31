import { purgeCache } from "@netlify/functions";
import { z } from "astro/zod";

import { WEBHOOK_SECRET } from "astro:env/server";

import type { APIRoute } from "astro";

export const prerender = false;

const schema = z.object({ id: z.string() });

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("X-Webhook-Secret") !== WEBHOOK_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = schema.parse(await request.json());

  await purgeCache({ tags: [result.id] });

  return new Response(`Revalidated entry with id ${result.id}`, { status: 202 });
};
