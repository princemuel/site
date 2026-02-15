// SPDX-License-Identifier: Apache-2.0
import "./src/assets/scripts/temporal";

import { defineConfig } from "astro/config";
import {
  adapter,
  envSchema,
  envVars,
  flags,
  fonts,
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
  //@ts-expect-error
  fonts: fonts,
  integrations: integrations,
  server: ({ command }) => ({ host: command === "dev" }),
  prefetch: true,
  markdown: markdown,
  image: images,
  adapter: adapter,
  vite: pluginsVite,
});
