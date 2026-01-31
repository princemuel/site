// SPDX-License-Identifier: Apache-2.0
import "./src/assets/scripts/temporal";

import { defineConfig } from "astro/config";
import {
  adapter,
  envSchema,
  envVars,
  flags,
  images,
  integrations,
  markdown,
  pluginsVite,
} from "./config";

// https://astro.build/config
export default defineConfig({
  site: envVars.PUBLIC_SITE_URL,
  env: { validateSecrets: true, schema: envSchema },
  experimental: flags,
  integrations: integrations,
  server: ({ command }) => ({ host: command === "dev" }),
  prefetch: true,
  markdown: markdown,
  image: images,
  adapter: adapter,
  vite: pluginsVite,
});
