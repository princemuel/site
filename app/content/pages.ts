import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro:schema";

export const pages = defineCollection({
  loader: glob({ base: "content/pages", pattern: "**/[^_]*.{md,mdx}" }),
  schema: z.object({
    title: z.string().min(2),
    headline: z.string().min(2).optional(),
    description: z.string().min(2),
    draft: z.boolean().default(false),
    publishedAt: z.string().datetime(),
    updatedAt: z.string().datetime().optional(),
    permalink: z.string().optional(),
  }),
});
