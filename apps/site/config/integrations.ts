// SPDX-License-Identifier: Apache-2.0
import markdown from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
// import pwa from "@vite-pwa/astro";
import codeblock from "astro-expressive-code";

import manifest from "./manifest.json";

import type { MdxOptions } from "@astrojs/mdx";
import type { SitemapOptions } from "@astrojs/sitemap";
import type { PwaOptions } from "@vite-pwa/astro";
import type { AstroUserConfig } from "astro";

type Config = NonNullable<AstroUserConfig["integrations"]>;

const options = {
  sitemap: {
    changefreq: "daily",
    priority: 0.7,
    lastmod: new Date(),
    filter: (page) => !/\/(?:api|draft|private)\/|\.(?:xml|rss)$|\/feed/.test(page),
  } as SitemapOptions,

  markdown: { gfm: true, extendMarkdownConfig: true } as Partial<MdxOptions>,

  pwa: {
    registerType: "prompt",
    pwaAssets: { config: true, overrideManifestIcons: true },
    experimental: { directoryAndTrailingSlashHandler: true },
    manifest: manifest as PwaOptions["manifest"],
    devOptions: { enabled: false, suppressWarnings: true, type: "module" },
    workbox: {
      cleanupOutdatedCaches: true,
      // clientsClaim: true,
      // navigateFallback: "/offline",
      // globPatterns: [
      //   "**/*.{css,js,jpg,jpeg,png,gif,webp,svg,ico,woff,woff2,ttf,eot}",
      // ],
      // navigateFallbackAllowlist: [/^\/api\/v\d+\/.*$/iu],
      // navigateFallbackDenylist: [
      //   /\.(?:png|gif|jpg|jpeg|webp|avif|svg|ico)$/iu,
      //   /\.(?:ttf|otf|woff|woff2)$/iu,
      //   /\.(?:css|js)$/iu,
      //   /\/sw\.js$/iu,
      //   /\.(?:pdf|mp4|webm|ogg|mp3|wav)$/iu,
      // ],
      // runtimeCaching: cachePreset,
    },
  } as PwaOptions,
};

export const integrations = [
  codeblock(),
  markdown(options.markdown),
  sitemap(options.sitemap),
  // pwa(options.pwa),
] satisfies Config;
