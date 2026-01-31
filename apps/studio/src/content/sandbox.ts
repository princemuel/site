// SPDX-License-Identifier: Apache-2.0
import { file } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

import type { Icon } from "virtual:astro-icon";

export const labels = defineCollection({
  loader: file("content/sandbox/labels.toml"),
  schema: z.object({
    text: z.string().min(2),
    icon: z.custom<Icon>(),
  }),
});

export const genres = defineCollection({
  loader: file("content/sandbox/genres.toml"),
  schema: z.object({
    text: z.string().min(2),
    icon: z.custom<Icon>(),
  }),
});

export const routes = defineCollection({
  loader: file("content/sandbox/routes.toml"),
  schema: z.object({
    href: z.string(),
    text: z.string().min(2),
    icon: z.custom<Icon>(),
  }),
});

export const shares = defineCollection({
  loader: file("content/sandbox/shares.toml"),
  schema: z.object({
    href: z.url(),
    text: z.string().min(2),
    icon: z.custom<Icon>(),
  }),
});

export const climes = defineCollection({
  loader: file("content/sandbox/climes.toml"),
  schema: z.object({
    main: z.string().min(2),
    description: z.string().min(2),
    icon: z.string().min(2),
  }),
});

export const socials = defineCollection({
  loader: file("content/sandbox/socials.toml"),
  schema: z.object({
    href: z.string().min(2),
    text: z.string().min(2),
    icon: z.custom<Icon>(),
    color: z.string().min(2).optional(),
  }),
});
