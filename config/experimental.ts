import type { AstroUserConfig } from "astro";
import { memoryCache } from "astro/config";

type Config = NonNullable<AstroUserConfig["experimental"]>;

export const experimental = {
  svgo: true,
  clientPrerender: true,
  contentIntellisense: true,
  chromeDevtoolsWorkspace: true,
  rustCompiler: true,
  cache: { provider: memoryCache() },
  queuedRendering: {
    enabled: true,
    poolSize: 1024,
    contentCache: true,
  },
} satisfies Config;
