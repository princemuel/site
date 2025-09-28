import { fonts } from "./fonts";

import type { AstroUserConfig } from "astro";

type Config = NonNullable<NonNullable<AstroUserConfig["experimental"]>>;

export const experimental = {
  clientPrerender: true,
  failOnPrerenderConflict: true,
  contentIntellisense: true,
  fonts: fonts,
  headingIdCompat: true,
  // csp: envVars.NODE_ENV !== "development",
  preserveScriptOrder: true,
  liveContentCollections: true,
  staticImportMetaEnv: true,
  chromeDevtoolsWorkspace: true,
} satisfies Config;
