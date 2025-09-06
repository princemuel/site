// import database from "@astrojs/db";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import iconify from "astro-icon";
import icons from "./iconify.json";

import type { MdxOptions } from "@astrojs/mdx";
import type { SitemapOptions } from "@astrojs/sitemap";
import type { AstroUserConfig } from "astro";
type IconifyOptions = Parameters<typeof iconify>[0];
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
  iconDir: "src/assets/icons",
  svgoOptions: { multipass: true },
} satisfies IconifyOptions;

export const integrations = [
  iconify(opts_icon),
  mdx(opts_mdx),
  sitemap(opts_sitemap),
  // database(),
] satisfies Config;
