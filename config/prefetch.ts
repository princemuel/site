// SPDX-License-Identifier: Apache-2.0

import type { AstroUserConfig } from "astro";

type Config = NonNullable<AstroUserConfig["prefetch"]>;

export const prefetch = {
  defaultStrategy: "hover",
  prefetchAll: false,
} satisfies Config;
