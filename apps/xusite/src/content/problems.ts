// SPDX-License-Identifier: Apache-2.0
import { revision } from "@/content/helpers";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

export default defineCollection({
  loader: glob({ base: "content/problems", pattern: "**/[!_]*.{md,mdoc}" }),
  schema: z.object({
    title: z.string(),
    status: z.number(),
    type: z.url(),
    description: z.string(),
    extensions: z.record(z.string(), z.string()).default({}),
    draft: z.boolean().default(false),
    publishedAt: z.iso.datetime({ offset: true }),
    updatedAt: z.iso.datetime({ offset: true }).optional(),
    revisions: z.array(revision).default([]),
  }),
});
