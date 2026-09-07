import type { SatteriProcessorOptions } from "@astrojs/markdown-satteri";
import type { AstroUserConfig } from "astro";

export type Config = NonNullable<AstroUserConfig["markdown"]>;
export type MarkdownOptions = SatteriProcessorOptions;
export type MdastPluginDefinition = NonNullable<MarkdownOptions["mdastPlugins"]>[number];
export type HastPluginDefinition = NonNullable<MarkdownOptions["hastPlugins"]>[number];

declare module "satteri" {
  interface SatteriAstroData {
    frontmatter: {
      date: Temporal.InstantLike;
      updated?: Temporal.InstantLike;
      words?: number;
      duration?: number;
      revisions?: { date: Temporal.InstantLike; note: string }[];
    };
  }
}
