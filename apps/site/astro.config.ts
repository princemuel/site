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

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  site: envVars.PUBLIC_SITE_URL,
  srcDir: "app",
  env: { validateSecrets: true, schema: envSchema },
  experimental: flags,
  integrations: integrations,
  server: { host: true },
  prefetch: { prefetchAll: true, defaultStrategy: "load" },
  markdown: markdown,
  image: images,
  adapter: node(adapter),
  vite: pluginsVite,
});
