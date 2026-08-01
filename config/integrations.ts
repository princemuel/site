import mdx from "@astrojs/mdx";
import sitemap, { type SitemapOptions } from "@astrojs/sitemap";
import type { AstroUserConfig } from "astro";
import code from "astro-expressive-code";

import manifest from "./manifest.json" with { type: "json" };
import pwa, { type PwaOptions } from "./plugins/vite-pwa-plugin";

type Config = NonNullable<AstroUserConfig["integrations"]>;

const PATTERNS = [/\/(?:api|draft|private)\//v, /\.(?:xml|rss)$/v, /\/feed/v];

const options = {
  sitemap: {
    changefreq: "daily",
    priority: 0.8,
    lastmod: new Date(),
    filter: (page) => !PATTERNS.some((regex) => regex.test(page)),
  } as SitemapOptions,

  pwa: {
    registerType: "prompt",
    pwaAssets: { config: true, overrideManifestIcons: true },
    experimental: { directoryAndTrailingSlashHandler: true },
    manifest: manifest as PwaOptions["manifest"],
    devOptions: { enabled: true, suppressWarnings: true, type: "module" },
    workbox: {
      cleanupOutdatedCaches: true,
      // ClientsClaim: true,
      // NavigateFallback: "/offline",
      // GlobPatterns: [
      //   "**/*.{css,js,jpg,jpeg,png,gif,webp,svg,ico,woff,woff2,ttf,eot}",
      // ],
      // NavigateFallbackAllowlist: [/^\/api\/v\d+\/.*$/iu],
      // NavigateFallbackDenylist: [
      //   /\.(?:png|gif|jpg|jpeg|webp|avif|svg|ico)$/iu,
      //   /\.(?:ttf|otf|woff|woff2)$/iu,
      //   /\.(?:css|js)$/iu,
      //   /\/sw\.js$/iu,
      //   /\.(?:pdf|mp4|webm|ogg|mp3|wav)$/iu,
      // ],
      // RuntimeCaching: cachePreset,
    },
  } as PwaOptions,
};

export const integrations = [
  code(),
  mdx(),
  sitemap(options.sitemap),
  pwa(options.pwa),
] satisfies Config;
