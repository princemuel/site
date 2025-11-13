import type { UserOptions } from "node_modules/@astrojs/node/dist/types";

type Config = UserOptions;

export const adapter = {
  mode: "standalone",
  experimentalStaticHeaders: true,
} satisfies Config;
// export const adapter = {
//   imageService: "cloudflare",
//   platformProxy: { enabled: true },
//   sessionKVBindingName: "SESSION",
// } satisfies Config;

// type Config = NetlifyIntegrationConfig;

// export const adapter = {
//   cacheOnDemandPages: true,
//   experimentalStaticHeaders: true,
//   devFeatures: false,
// } satisfies Config;
