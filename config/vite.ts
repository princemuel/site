import tailwindcss from "@tailwindcss/vite";
import type { AstroUserConfig } from "astro";

import { envVars } from "./dotenv";
import { getGitCommit } from "./helpers";

type Config = NonNullable<AstroUserConfig["vite"]>;

export const pluginsVite = {
  assetsInclude: ["./src/db/migrations/*.sql"],
  plugins: [tailwindcss()],
  define: {
    __BUILD_TIME__: JSON.stringify(Temporal.Now.instant()),
    __DEPLOY_CHANNEL__: JSON.stringify(envVars.DEPLOY_CHANNEL ?? "nightly"),
    __COMMIT_SHA__: JSON.stringify(getGitCommit(envVars.COMMIT_REF)),
    __UUID_NAMESPACE__: JSON.stringify("de06242e-6f55-4831-8faf-d7dae94be955"),
  },
  envPrefix: ["PUBLIC_"],
  ssr: { external: ["@resvg/resvg-js"] },
  optimizeDeps: { exclude: ["@resvg/resvg-js"] },
  build: { rolldownOptions: { external: ["@resvg/resvg-js"] } },
} satisfies Config;
