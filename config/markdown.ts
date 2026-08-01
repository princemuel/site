import { satteriHeadingIdsPlugin as hast_heading_ids, satteri } from "@astrojs/markdown-satteri";

import { hast_external_links } from "./plugins/hast-external-links";
import { mdast_deruntify } from "./plugins/mdast-deruntify";
import { mdast_modified_time } from "./plugins/mdast-modified-time";
import { mdast_reading_time } from "./plugins/mdast-reading-time";
import type { Config } from "./plugins/types";

export const markdown = {
  syntaxHighlight: "shiki",
  shikiConfig: { themes: { light: "vitesse-light", dark: "vitesse-dark" } },
  processor: satteri({
    features: { directive: true, smartPunctuation: true, superscript: true, subscript: true },
    mdastPlugins: [mdast_deruntify, mdast_reading_time, mdast_modified_time],
    hastPlugins: [hast_external_links, hast_heading_ids()],
  }),
} satisfies Config;
