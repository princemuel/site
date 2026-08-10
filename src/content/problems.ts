import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

import { ObjectKeys, revision } from "@/content/helpers";

export default defineCollection({
  loader: glob({ base: `content/problems`, pattern: "**/[!_]*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    status: z.uint32(),
    type: z.url(),
    description: z.string(),
    extensions: z.record(ObjectKeys, z.string()).default({}),
    published: z.enum(["never", "planned", "draft", "released"]).default("planned"),
    date: z.iso.datetime({ offset: true }),
    updated: z.iso.datetime({ offset: true }).optional(),
    revisions: z.array(revision).default([]),
  }),
});
