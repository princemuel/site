import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";

import { baseSchema } from "@/content/helpers";

export default defineCollection({
  loader: glob({ base: "content/pages", pattern: "**/[!_]*.{md,mdx}" }),
  schema: baseSchema,
});
