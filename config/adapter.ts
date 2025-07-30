import { type NetlifyIntegrationConfig } from "@astrojs/netlify";

type Config = NetlifyIntegrationConfig;

export const adapter = {
  cacheOnDemandPages: true,
  experimentalStaticHeaders: true,
  devFeatures: { images: true, environmentVariables: false },
} satisfies Config;
