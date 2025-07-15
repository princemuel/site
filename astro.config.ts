import netlify from "@astrojs/netlify";

import { defineConfig } from "astro/config";

import { envSchema, flags, images, integrations, markdown, pluginsVite } from "./config";

// https://astro.build/config
export default defineConfig({
  srcDir: "./app",
  site: "https://example.com",
  env: { validateSecrets: true, schema: envSchema },
  experimental: flags,
  integrations: integrations,
  server: { host: true },
  prefetch: { prefetchAll: true, defaultStrategy: "viewport" },
  markdown: markdown,
  image: images,
  adapter: netlify({ experimentalStaticHeaders: true, cacheOnDemandPages: true }),
  //@ts-expect-error ignore this error
  vite: pluginsVite,
});
