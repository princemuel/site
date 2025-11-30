// SPDX-License-Identifier: Apache-2.0
import tailwindcss from "@tailwindcss/vite";

import { envVars } from "./dotenv";
import { getGitCommit } from "./helpers";

import type { AstroUserConfig } from "astro";

type Config = NonNullable<AstroUserConfig["vite"]>;

export const pluginsVite = {
  plugins: [tailwindcss()],
  define: {
    __DEPLOY_CHANNEL__: JSON.stringify(envVars.DEPLOY_CHANNEL ?? "development"),
    __BUILD_TIME__: JSON.stringify(new Date()),
    __GIT_COMMIT__: JSON.stringify(getGitCommit(envVars.COMMIT_REF)),
  },
} satisfies Config;
