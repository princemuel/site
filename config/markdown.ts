import { satteriHeadingIdsPlugin as HastHeadingIds, satteri } from "@astrojs/markdown-satteri";

import { HastExternalLinks } from "./plugins/hast-external-links";
import { MdastDeruntify } from "./plugins/mdast-deruntify";
import { MdastModifiedTime } from "./plugins/mdast-modified-time";
import { MdastReadingTime } from "./plugins/mdast-reading-time";
import type { Config } from "./plugins/types";

export const markdown = {
  syntaxHighlight: "shiki",
  shikiConfig: { themes: { light: "vitesse-light", dark: "vitesse-dark" } },
  processor: satteri({
    features: { directive: true, smartPunctuation: true, superscript: true, subscript: true },
    mdastPlugins: [MdastDeruntify(), MdastReadingTime(), MdastModifiedTime()],
    hastPlugins: [HastExternalLinks, HastHeadingIds()],
  }),
} satisfies Config;
