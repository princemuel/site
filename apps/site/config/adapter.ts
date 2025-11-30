// SPDX-License-Identifier: Apache-2.0
import provider from "@astrojs/netlify";
export const adapter = provider({
  cacheOnDemandPages: true,
  experimentalStaticHeaders: true,
  devFeatures: false,
});

// import provider from "@astrojs/node";
// export const adapter = provider({
//   mode: "standalone",
//   experimentalStaticHeaders: true,
// });
