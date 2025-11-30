// SPDX-License-Identifier: Apache-2.0
import { baseSchema } from "@/content/helpers";
import { glob } from "astro/loaders";
import { defineCollection, reference } from "astro:content";
import { z } from "astro:schema";

export default defineCollection({
  loader: glob({ base: "content/journal", pattern: "**/[^_]*.{md,mdx}" }),
  schema: baseSchema.extend({
    category: z.string().min(2),
    mood: z.string().min(2),
    location: z.tuple([z.number().finite(), z.number().finite()]),
    weather: z.tuple([z.number().finite(), z.number().finite()]),
    links: z.array(z.object({ label: reference("labels"), url: z.string().min(2).url() })).default([]),
  }),
});
