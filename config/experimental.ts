import type { AstroUserConfig } from "astro";

type Config = NonNullable<AstroUserConfig["experimental"]>;

export const experimental = {
  svgo: true,
  clientPrerender: true,
  contentIntellisense: true,
  chromeDevtoolsWorkspace: true,
  // rustCompiler: true,
  // queuedRendering: {
  //   enabled: true,
  //   poolSize: 1024,
  //   contentCache: true,
  // },
} satisfies Config;
