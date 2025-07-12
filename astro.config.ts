import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  output: "static",
  srcDir: "./app",
  site: "https://example.com",
  env: { validateSecrets: true, schema: {} },
  experimental: {},
  integrations: [],
  prefetch: { prefetchAll: true, defaultStrategy: "viewport" },
  session: { driver: "netlify-blobs" },
  markdown: {},
  image: {},
});
