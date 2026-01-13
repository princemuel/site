// SPDX-License-Identifier: Apache-2.0
import adaptor from "@astrojs/netlify";
export const adapter = adaptor({
  // mode: "standalone",
  cacheOnDemandPages: true,
  experimentalStaticHeaders: true,
  // devFeatures: false,
});
