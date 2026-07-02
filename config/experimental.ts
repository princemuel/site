import type { AstroUserConfig } from "astro";
import { svgoOptimizer } from "astro/config";

type Config = NonNullable<AstroUserConfig["experimental"]>;

export const experimental = {
  svgOptimizer: svgoOptimizer(),
  clientPrerender: true,
  contentIntellisense: true,
  chromeDevtoolsWorkspace: true,
} satisfies Config;
