import {
  satteriHeadingIdsPlugin as hast_heading_ids,
  satteri,
} from "@astrojs/markdown-satteri";

import { hast_external_links } from "./plugins/hast-external-links.ts";
import { mdast_deruntify } from "./plugins/mdast-deruntify.ts";
import { mdast_modified_time } from "./plugins/mdast-modified-time.ts";
import { mdast_reading_time } from "./plugins/mdast-reading-time.ts";
import type { Config } from "./plugins/types.ts";

export const markdown = {
  syntaxHighlight: "shiki",
  shikiConfig: { themes: { light: "github-light-default", dark: "github-dark-default" } },
  processor: satteri({
    features: {
      math: true,
      directive: true,
      headingAttributes: true,
      definitionList: true,
      smartPunctuation: true,
      superscript: true,
      subscript: true,
    },
    mdastPlugins: [mdast_deruntify, mdast_reading_time, mdast_modified_time],
    hastPlugins: [hast_external_links, hast_heading_ids()],
  }),
} satisfies Config;
