import tailwindcss from "@tailwindcss/vite";

import { envVars } from "./dotenv";
import { getGitCommit } from "./helpers";

import type { AstroUserConfig } from "astro";

type Config = NonNullable<AstroUserConfig["vite"]>;

export const pluginsVite = {
  plugins: [tailwindcss()],
  define: {
    __BUILD_TIME__: JSON.stringify(Temporal.Now.instant().toString()),
    __DEPLOY_CHANNEL__: JSON.stringify(envVars.DEPLOY_CHANNEL ?? "nightly"),
    __GIT_COMMIT__: JSON.stringify(getGitCommit(envVars.COMMIT_REF)),
  },
  envPrefix: ["PUBLIC_"],
} satisfies Config;
