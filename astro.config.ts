// import netlify from "@astrojs/netlify";

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

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  srcDir: "./app",
  site: envVars.PUBLIC_SITE_URL,
  env: { validateSecrets: true, schema: envSchema },
  experimental: flags,
  integrations: integrations,
  server: { host: true },
  prefetch: { prefetchAll: true, defaultStrategy: "viewport" },
  markdown: markdown,
  image: images,
  // adapter: netlify(adapter),
  adapter: cloudflare(adapter),
  //@ts-expect-error ignore this error
  vite: pluginsVite,
});
