// import database from "@astrojs/db";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
// import svelte from "@astrojs/svelte";
import sentry from "@sentry/astro";
import spotlightjs from "@spotlightjs/astro";
import pwa from "@vite-pwa/astro";
import codeblock from "astro-expressive-code";
import icon from "astro-icon";

import icons from "./iconify.json";
import manifest from "./manifest.json";

import type { MdxOptions } from "@astrojs/mdx";
import type { SitemapOptions } from "@astrojs/sitemap";
import type { PwaOptions } from "@vite-pwa/astro";
import type { AstroUserConfig } from "astro";
import type { SentryOptions } from "node_modules/@sentry/astro/build/types/integration/types";
import { envVars } from "./dotenv";

type IconifyOptions = Parameters<typeof icon>[0];
type Config = NonNullable<NonNullable<AstroUserConfig["integrations"]>>;

const options = {
  sitemap: {
    changefreq: "weekly",
    priority: 0.7,
    lastmod: new Date(),
    filter: (page) => !/\/(?:api|draft|private)\/|\.(?:xml|rss)$|\/feed/.test(page),
  } as SitemapOptions,

  mdx: {
    gfm: true,
    extendMarkdownConfig: true,
  } as Partial<MdxOptions>,

  icon: {
    include: icons,
    iconDir: "app/assets/icons",
    svgoOptions: { multipass: true },
  } as IconifyOptions,

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

  sentry: {
    project: "princemuel-io",
    authToken: envVars.SENTRY_AUTH_TOKEN,
  } as SentryOptions,
};

export const integrations = [
  icon(options.icon),
  codeblock(),
  mdx(options.mdx),
  sentry(options.sentry),
  spotlightjs(),
  sitemap(options.sitemap),
  pwa(options.pwa),
  // database({ mode: 'web' }),
  // svelte(),
] satisfies Config;
