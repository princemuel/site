import { defineConfig } from "astro/config";
import "temporal-polyfill/global";
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
  site: envVars.PUBLIC_SITE_URL,
  env: { validateSecrets: true, schema: envSchema },
  experimental: flags,
  fonts,
  integrations,
  server: ({ command }) => ({ host: command === "dev" }),
  prefetch,
  security,
  markdown,
  image: images,
  adapter,
  vite: pluginsVite,
});
