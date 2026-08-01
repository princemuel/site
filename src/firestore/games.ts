import { z } from "astro/zod";
import { defineLiveCollection } from "astro:content";

export default defineLiveCollection({
  loader: () => ({}),
  schema: z.object({
    name: z.string().min(2),
    handle: z.string().min(2),
    email: z.email().optional(),
    bio: z.string().min(2).optional(),
    role: z.string().min(2).optional(),
    location: z.string().min(2).optional(),
    // oxlint-disable-next-line unicorn/max-nested-calls
    links: z.record(z.string(), z.url()).default({}),
  }),
});
