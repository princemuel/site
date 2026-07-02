import path from "node:path";

import type { ImageMetadata } from "astro";
import { z } from "astro/zod";
import type { ImageFunction } from "astro:content";

import { iconNames } from "@/assets/icons";

export const content = path.join(process.cwd(), "content");

export const revision = z.object({ date: z.iso.datetime(), note: z.string() });

export const directives = [
  "noindex",
  "nofollow",
  "nosnippet",
  "noarchive",
  "noimageindex",
] as const;
export const robots = z.enum(directives);

export const baseSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  headline: z.string().default(""),
  summary: z.string().default(""),
  tags: z.array(z.string()).default([]),
  date: z.iso.datetime(),
  updated: z.iso.datetime().optional(),
  published: z.enum(["never", "draft", "release"]).default("never"),
  revisions: z.array(revision).default([]),
  duration: z.uint32().default(0),
  words: z.uint32().lte(65_535).default(0),
  language: z.enum(["en", "es", "fr"]).default("en"),
  permalink: z.string().default("/"),
  robots: z.array(robots).default([]),
});

export const Keys = z.union([z.string(), z.number(), z.symbol()]);

export const IconEnum = z.enum(iconNames);

type ImageInfo = ImageMetadata;
export const img = (image: ImageFunction) =>
  z
    .url({ protocol: /^https$/, hostname: z.regexes.domain })
    .transform((url) => ({ src: url, width: 1200, height: 630, format: "jpg" }) as ImageInfo)
    .or(image());

// Const generateSlug = ((options) => {
//   If (options.data.slug) return options.data.slug as string;
//   Return path.basename(options.entry, ".md");
// }) satisfies Parameters<typeof glob>[0]["generateId"];

// Type _Content = ["books", "films", "series", "games"][number];

// Export const withMetadata = (content: Content) => {
//   Const loader = glob({
//     Base: `content/content`,
//     Pattern: "**/[!_]*.{md,mdx}",
//   });

//   Return {
//     ...loader,
//     Async load(context) {
//       Await loader.load(context);

//       Const entries = Array.from(context.store.entries());
//       Context.store.clear();

//       Const requests = entries.map(async ([id, entry]) => {
//         If (!entry.filePath) return [id, entry] as const;
//         Try {
//           Const metadata = await loadMeta(entry.filePath);
//           Const rendered = await context.renderMarkdown("");

//           Return [id, { ...entry, data: { ...entry.data, metadata } }] as const;
//         } catch (error) {
//           Println$(`Failed to load metadata for ${entry.filePath}:`, error);
//           Return [id, { ...entry, data: { ...entry.data, metadata: {} } }] as const;
//         }
//       });

//       Const response = await Promise.all(requests);

//       For (const [_, entry] of response) context.store.set(entry);

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

// Async function loadMeta(filePath: string): Promise<unknown> {
//   Const file = path.join(path.dirname(filePath), "meta.json");
//   Try {
//     Return JSON.parse(await fs.readFile(file, "utf-8"));
//   } catch (error) {
//     // File doesn't exist, return empty metadata
//     If ((error as NodeJS.ErrnoException).code === "ENOENT") return {};
//     Throw error; // Re-throw other errors (parsing, permissions, etc.)
//   }
// }

export const published = (value: string, strict = false) => {
  return import.meta.env.PROD || strict
    ? value !== "never" && value !== "draft"
    : value !== "never";
};
