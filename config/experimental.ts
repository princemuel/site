import { fonts } from "./fonts";

import type { AstroUserConfig } from "astro";

type Config = NonNullable<NonNullable<AstroUserConfig["experimental"]>>;

export const experimental = {
  clientPrerender: true,
  liveContentCollections: true,
  // csp: envVars.NODE_ENV !== "development",
  contentIntellisense: true,
  headingIdCompat: true,
  preserveScriptOrder: true,
  fonts: fonts,
  staticImportMetaEnv: true,
  chromeDevtoolsWorkspace: true,
} satisfies Config;
