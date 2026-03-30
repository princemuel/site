// SPDX-License-Identifier: Apache-2.0

import type { AstroUserConfig } from "astro";

type Config = NonNullable<AstroUserConfig["experimental"]>;

export const experimental = {
  svgo: true,
  clientPrerender: true,
  contentIntellisense: true,
  chromeDevtoolsWorkspace: true,
  // rustCompiler: true,
  queuedRendering: {
    enabled: true,
    poolSize: 1024, // store up to 1k nodes to be reused across renderers
    contentCache: true, // enable re-use of node values
  },
} satisfies Config;
