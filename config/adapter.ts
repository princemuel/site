import { type Options } from "@astrojs/cloudflare";

type Config = Options;

export const adapter = {
  imageService: "cloudflare",
  platformProxy: { enabled: true },
} satisfies Config;

// type Config = NetlifyIntegrationConfig;

// export const adapter = {
//   cacheOnDemandPages: true,
//   experimentalStaticHeaders: true,
//   devFeatures: false,
// } satisfies Config;
