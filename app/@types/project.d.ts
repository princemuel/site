declare const __brand: unique symbol;

type Brand<T, B extends string> = T & { [__brand]: B };

type ImageProps = import("astro:assets").LocalImageProps | import("astro:assets").RemoteImageProps;
type ImageSrc = ImageProps["src"];

interface Robots {
  noindex?: boolean;
  nofollow?: boolean;
  nosnippet?: boolean;
  noarchive?: boolean; // prevent caching of the page
  noimageindex?: boolean; // exclude images on the page from search
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
  image?: string | URL; // og:image — the preview image URL
  imageAlt?: string; // og:image:alt — important for a11y
  name?: string; // og:site_name
  locale?: string; // og:locale e.g. "en_US"
}
interface Twitter {
  handle?: `@${string}`;
  card?: "summary" | "summary_large_image" | "app" | "player";
  creator?: `@${string}`;
  image?: string | URL;
  imageAlt?: string;
}

type Resource = "projects" | "articles" | "blog";
