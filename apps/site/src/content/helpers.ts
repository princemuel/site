// SPDX-License-Identifier: Apache-2.0
import { z } from "astro/zod";

import type { ImageMetadata } from "astro";
import type { ImageFunction } from "astro:content";

export const revision = z.object({ note: z.string(), date: z.iso.datetime({ offset: true }) });
export const baseSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  headline: z.string().default(""),
  summary: z.string().default(""),
  draft: z.boolean().default(true),
  comments: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  publishedAt: z.iso.datetime({ offset: true }),
  updatedAt: z.iso.datetime({ offset: true }).optional(),
  revisions: z.array(revision).default([]),
  duration: z.string().default("1 min read"),
  words: z.uint32().lte(65_535).default(0),
  language: z.enum(["en", "es", "fr"]).default("en"),
  permalink: z.string().default("/"),
});

export const Keys = z.union([z.string(), z.number(), z.symbol()]);

type ImageInfo = ImageMetadata;
export const img = (image: ImageFunction) =>
  z
    .url({ protocol: /^https$/, hostname: z.regexes.domain })
    .transform((url) => ({ src: url, width: 1200, height: 630, format: "jpg" }) as ImageInfo)
    .or(image());

// const generateSlug = ((options) => {
//   if (options.data.slug) return options.data.slug as string;
//   return path.basename(options.entry, ".md");
// }) satisfies Parameters<typeof glob>[0]["generateId"];

// type _Content = ["books", "films", "series", "games"][number];

// export const withMetadata = (content: Content) => {
//   const loader = glob({
//     base: `content/${content}`,
//     pattern: "**/[!_]*.{md,mdoc}",
//   });

//   return {
//     ...loader,
//     async load(context) {
//       await loader.load(context);

//       const entries = Array.from(context.store.entries());
//       context.store.clear();

//       const requests = entries.map(async ([id, entry]) => {
//         if (!entry.filePath) return [id, entry] as const;
//         try {
//           const metadata = await loadMeta(entry.filePath);
//           const rendered = await context.renderMarkdown("");

//           return [id, { ...entry, data: { ...entry.data, metadata } }] as const;
//         } catch (error) {
//           println$(`Failed to load metadata for ${entry.filePath}:`, error);
//           return [id, { ...entry, data: { ...entry.data, metadata: {} } }] as const;
//         }
//       });

//       const response = await Promise.all(requests);

//       for (const [_, entry] of response) context.store.set(entry);

//       // for (const entry of entries) {
//       //   if (!entry[1].filePath) continue;

//       //   const metadataPath = path.join(path.dirname(entry[1].filePath), "./meta.json");
//       //   const metadata = JSON.parse(readFileSync(metadataPath, "utf-8")) as unknown;

//       //   context.store.set({
//       //     ...entry[1],
//       //     data: { ...entry[1].data, metadata: metadata },
//       //   });
//       // }
//     },
//   } satisfies Loader;
// };

// async function loadMeta(filePath: string): Promise<unknown> {
//   const file = path.join(path.dirname(filePath), "meta.json");
//   try {
//     return JSON.parse(await fs.readFile(file, "utf-8"));
//   } catch (error) {
//     // File doesn't exist, return empty metadata
//     if ((error as NodeJS.ErrnoException).code === "ENOENT") return {};
//     throw error; // Re-throw other errors (parsing, permissions, etc.)
//   }
// }
