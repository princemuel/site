import { defineConfig } from "astro/config";

import "./app/polyfills/temporal";
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
  prefetch,
  security,
} from "./config";

// https://astro.build/config
export default defineConfig({
  output: "static",
  srcDir: "./app",
  site: envVars.PUBLIC_SITE_URL,
  env: { validateSecrets: true, schema: envSchema },
  experimental: flags,
  fonts: fonts,
  integrations: integrations,
  server: ({ command }) => ({ host: command === "dev" }),
  prefetch: prefetch,
  security: security,
  markdown: markdown,
  image: images,
  adapter: adapter,
  vite: pluginsVite,
});
