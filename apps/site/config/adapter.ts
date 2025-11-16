import provider from "@astrojs/netlify";

export const adapter = provider({
  cacheOnDemandPages: true,
  experimentalStaticHeaders: true,
  devFeatures: false,
});
