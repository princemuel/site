// SPDX-License-Identifier: Apache-2.0
import { fonts } from "./fonts";

import type { AstroUserConfig } from "astro";

type Config = NonNullable<NonNullable<AstroUserConfig["experimental"]>>;

export const experimental = {
  svgo: true,
  clientPrerender: true,
  contentIntellisense: true,
  fonts: fonts,
  chromeDevtoolsWorkspace: true,
} satisfies Config;
