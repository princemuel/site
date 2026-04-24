import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection, reference } from "astro:content";

import { baseSchema } from "@/content/helpers";

export default defineCollection({
  loader: glob({ base: "content/journal", pattern: "**/[!_]*.{md,mdx}" }),
  schema: baseSchema.safeExtend({
    category: z.string().min(2),
    mood: z.string().min(1),
    comments: z.boolean().default(false),
    links: z.array(z.object({ label: reference("labels"), url: z.url() })).default([]),
  }),
});
