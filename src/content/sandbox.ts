import { file } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

import { IconEnum } from "@/content/helpers";

export const labels = defineCollection({
  loader: file("content/sandbox/labels.toml"),
  schema: z.object({
    text: z.string().min(2),
    icon: IconEnum,
    order: z.uint32().default(0),
  }),
});

export const genres = defineCollection({
  loader: file("content/sandbox/genres.toml"),
  schema: z.object({
    text: z.string().min(2),
    icon: IconEnum,
    order: z.uint32().default(0),
  }),
});

export const routes = defineCollection({
  loader: file("content/sandbox/routes.toml"),
  schema: z.object({
    href: z.string(),
    text: z.string().min(2),
    icon: IconEnum,
    order: z.uint32().default(0),
  }),
});

export const socials = defineCollection({
  loader: file("content/sandbox/socials.toml"),
  schema: z.object({
    href: z.string().min(2),
    text: z.string().min(2),
    icon: IconEnum,
    order: z.uint32().default(0),
    color: z.string().min(2).optional(),
  }),
});

export const sharers = defineCollection({
  loader: file("content/sandbox/sharers.toml"),
  schema: z.object({
    href: z.string(),
    text: z.string().min(2),
    icon: IconEnum,
    order: z.uint32().default(0),
  }),
});
