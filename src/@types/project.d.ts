declare const __brand: unique symbol;

type Brand<T, B extends string> = T & { [__brand]: B };

type ImageProps = import("astro:assets").LocalImageProps | import("astro:assets").RemoteImageProps;
type ImageSrc = ImageProps["src"];

interface Robots {
  noindex?: boolean;
  nofollow?: boolean;
  nosnippet?: boolean;
  noarchive?: boolean; // Prevent caching of the page
  noimageindex?: boolean; // Exclude images on the page from search
}

interface Meta {
  title?: [value: string, absolute?: boolean];
  description: string;
  keywords?: string[];
  canonical?: string | URL;
  medium?: OpenGraph["type"];
  date: Parameters<Temporal.InstantConstructor["from"]>[0];
  updated?: Parameters<Temporal.InstantConstructor["from"]>[0];
  robots?: Robots;
  language?: "en" | "fr" | "es" | "de" | "pt";
  includeOg?: boolean;
}
interface OpenGraph {
  kind?: "website" | "article" | "book" | "profile";
  image?: string | URL; // Og:image — the preview image URL
  imageAlt?: string; // Og:image:alt — important for a11y
  name?: string; // Og:site_name
  locale?: string; // Og:locale e.g. "en_US"
}
interface Twitter {
  handle?: `@${string}`;
  card?: "summary" | "summary_large_image" | "app" | "player";
  creator?: `@${string}`;
  image?: string | URL;
  imageAlt?: string;
}

type Resource = "projects" | "articles" | "blog";
