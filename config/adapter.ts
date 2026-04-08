// SPDX-License-Identifier: Apache-2.0
import adapter from "@astrojs/netlify";
export default adapter({
  cacheOnDemandPages: true,
  imageCDN: true,
  staticHeaders: true,
  devFeatures: false,
});
