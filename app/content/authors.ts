import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro:schema";

import { img } from "@/content/helpers";

export const authors = defineCollection({
  loader: glob({ base: "content/authors", pattern: "**/[^_]*.toml" }),
  schema: ({ image }) =>
    z.object({
      name: z.string().min(2),
      handle: z.string().min(2),
      email: z.string().min(2).email().optional(),
      bio: z.string().min(2).optional(),
      role: z.string().min(2).optional(),
      thumbnail: img(image).optional(),
      image: img(image).optional(),
      location: z.string().min(2).optional(),
      links: z.record(z.string().url()).default({}),
    }),
});
