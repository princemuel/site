import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection, reference } from "astro:content";

import { baseSchema } from "@/content/helpers";

export default defineCollection({
  loader: glob({ base: "content/projects", pattern: "**/[!_]*.{md,mdx}" }),
  schema: ({ image }) =>
    baseSchema.safeExtend({
      category: z.string().min(2),
      featured: z.boolean().default(false),
      image: image().optional(),
      author: reference("authors"),
      tools: z.array(z.string()).default([]),
      contributors: z.array(reference("authors")).default([]),
      status: z
        .enum(["concept", "planned", "in-progress", "completed", "archived"])
        .default("planned"),
      links: z.array(z.object({ label: reference("labels"), url: z.url() })).default([]),
    }),
});
