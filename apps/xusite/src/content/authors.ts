// SPDX-License-Identifier: Apache-2.0
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

import { img } from "@/content/helpers";

export default defineCollection({
  loader: glob({ base: "content/authors", pattern: "**/[^_]*.toml" }),
  schema: ({ image }) =>
    z.object({
      name: z.string().min(2),
      handle: z.string().min(2),
      email: z.email().optional(),
      bio: z.string().min(2).optional(),
      role: z.string().min(2).optional(),
      thumbnail: img(image).optional(),
      image: img(image).optional(),
      location: z.string().min(2).optional(),
      links: z.record(z.string(), z.url()).default({}),
    }),
});
