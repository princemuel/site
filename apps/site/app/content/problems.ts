import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro:schema";

export default defineCollection({
  loader: glob({ base: "content/problems", pattern: "**/[^_]*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    status: z.number(),
    type: z.string().url(),
    description: z.string(),
    extensions: z.record(z.string()).default({}),
    draft: z.boolean().default(false),
  }),
});
