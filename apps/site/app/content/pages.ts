// SPDX-License-Identifier: Apache-2.0
import { baseSchema } from "@/content/helpers";
import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";

export default defineCollection({
  loader: glob({ base: "content/pages", pattern: "**/[^_]*.{md,mdx}" }),
  schema: baseSchema.extend({}),
});
