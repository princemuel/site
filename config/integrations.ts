// import database from "@astrojs/db";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import svelte from "@astrojs/svelte";
import sentry from "@sentry/astro";
import spotlightjs from "@spotlightjs/astro";
import pwa from "@vite-pwa/astro";
import code from "astro-expressive-code";
import icon from "astro-icon";

import { envVars } from "./dotenv";

import icons from "./iconify.json";
import manifest from "./manifest.json";

import type { MdxOptions } from "@astrojs/mdx";
import type { SitemapOptions } from "@astrojs/sitemap";
import type { PwaOptions } from "@vite-pwa/astro";
import type { AstroUserConfig } from "astro";

type IconifyOptions = Parameters<typeof icon>[0];
type Config = NonNullable<NonNullable<AstroUserConfig["integrations"]>>;

const opts_sitemap = {
  changefreq: "weekly",
  priority: 0.7,
  lastmod: new Date(),
  filter: (page) => !/\/(?:api|draft|private)\/|\.(?:xml|rss)$|\/feed/.test(page),
} satisfies SitemapOptions;

const opts_mdx = {
  gfm: true,
  extendMarkdownConfig: true,
} satisfies Partial<MdxOptions>;

export const opts_icon = {
  include: icons,
  iconDir: "app/assets/icons",
  svgoOptions: { multipass: true },
} satisfies IconifyOptions;

const opts_sentry = {
  sourceMapsUploadOptions: {
    project: "princemuel-io",
    authToken: envVars.SENTRY_AUTH_TOKEN,
  },
};

export const opts_pwa = {
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
} satisfies PwaOptions;

export const integrations = [
  sentry(opts_sentry),
  spotlightjs(),
  icon(opts_icon),
  code(),
  mdx(opts_mdx),
  sitemap(opts_sitemap),
  // database({ mode: 'web' }),
  svelte(),
  pwa(opts_pwa),
] satisfies Config;
