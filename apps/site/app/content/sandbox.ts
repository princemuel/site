// SPDX-License-Identifier: Apache-2.0
import { file } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro:schema";

import type { Icon } from "virtual:astro-icon";

export const labels = defineCollection({
  loader: file("content/sandbox/labels.yml"),
  schema: z.object({
    text: z.string().min(2),
    icon: z.custom<Icon>((val) => typeof val === "string"),
  }),
});

export const genres = defineCollection({
  loader: file("content/sandbox/genres.yml"),
  schema: z.object({
    text: z.string().min(2),
    icon: z.custom<Icon>((val) => typeof val === "string"),
  }),
});

export const routes = defineCollection({
  loader: file("content/sandbox/routes.yml"),
  schema: z.object({
    href: z.string(),
    text: z.string().min(2),
    icon: z.custom<Icon>((val) => typeof val === "string"),
  }),
});

export const shares = defineCollection({
  loader: file("content/sandbox/shares.yml"),
  schema: z.object({
    href: z.string().min(2).url(),
    text: z.string().min(2),
    icon: z.custom<Icon>((val) => typeof val === "string"),
  }),
});

export const socials = defineCollection({
  loader: file("content/sandbox/socials.yml"),
  schema: z.object({
    href: z.string().min(2),
    text: z.string().min(2),
    icon: z.custom<Icon>((val) => typeof val === "string"),
    color: z.string().min(2).optional(),
  }),
});
