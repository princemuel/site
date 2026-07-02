import type { SatteriProcessorOptions } from "@astrojs/markdown-satteri";
import type { AstroUserConfig } from "astro";

export type Config = NonNullable<AstroUserConfig["markdown"]>;
export type MarkdownOptions = SatteriProcessorOptions;
export type MdastPlugin = NonNullable<MarkdownOptions["mdastPlugins"]>[number];
export type HastPlugin = NonNullable<MarkdownOptions["hastPlugins"]>[number];
