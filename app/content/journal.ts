import { defineCollection } from "astro:content";

export const journal = defineCollection({});
// export const journal = defineCollection({
//   loader: glob({ base: "content/journal", pattern: "**/[^_]*.{md,mdx}" }),
//   schema: z.object({
//     draft: z.boolean().default(false),
//   }),
// });
