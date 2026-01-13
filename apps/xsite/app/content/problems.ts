// SPDX-License-Identifier: Apache-2.0
import { revision } from "@/content/helpers";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

export default defineCollection({
  loader: glob({ base: "content/problems", pattern: "**/[^_]*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    status: z.number(),
    type: z.string().url(),
    description: z.string(),
    extensions: z.record(z.string(), z.string()).default({}),
    draft: z.boolean().default(false),
    publishedAt: z.string().datetime(),
    updatedAt: z.string().datetime().optional(),
    revisions: z.array(revision).default([]),
  }),
});
