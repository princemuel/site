import type { AstroUserConfig } from "astro";

type Config = NonNullable<AstroUserConfig["experimental"]>;

export const experimental = {
  svgo: true,
  clientPrerender: true,
  contentIntellisense: true,
  chromeDevtoolsWorkspace: true,
} satisfies Config;
