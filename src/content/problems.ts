// SPDX-License-Identifier: Apache-2.0
import { Keys, revision } from "@/content/helpers";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

export default defineCollection({
  loader: glob({ base: "content/problems", pattern: "**/[!_]*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    status: z.uint32(),
    type: z.url(),
    description: z.string(),
    extensions: z.record(Keys, z.string()).default({}),
    draft: z.boolean().default(false),
    date: z.iso.datetime({ offset: true }),
    updated: z.iso.datetime({ offset: true }).optional(),
    revisions: z.array(revision).default([]),
  }),
});
