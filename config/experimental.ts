import type { AstroUserConfig } from "astro";
import { svgoOptimizer } from "astro/config";

type Config = NonNullable<AstroUserConfig["experimental"]>;

export const experimental = {
  clientPrerender: true,
  svgOptimizer: svgoOptimizer(),
  contentIntellisense: true,
  incrementalBuild: true,
  chromeDevtoolsWorkspace: true,
  collectionStorage: { type: "chunked", chunkSize: 1024 * 1024 },
} satisfies Config;
