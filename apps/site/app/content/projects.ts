// SPDX-License-Identifier: Apache-2.0
import { baseSchema, img } from "@/content/helpers";
import { glob } from "astro/loaders";
import { defineCollection, reference } from "astro:content";
import { z } from "astro:schema";

export default defineCollection({
  loader: glob({ base: "content/projects", pattern: "**/[^_]*.{md,mdx}" }),
  schema: ({ image }) =>
    baseSchema.extend({
      category: z.string().min(2),
      featured: z.boolean().default(false),
      image: img(image).optional(),
      author: reference("authors"),
      tools: z.array(z.string()).default([]),
      contributors: z.array(reference("authors")).default([]),
      status: z.enum(["concept", "planned", "in-progress", "completed", "archived"]).default("planned"),
      links: z.array(z.object({ label: reference("labels"), url: z.string().min(2).url() })).default([]),
    }),
});
