// SPDX-License-Identifier: Apache-2.0
export default async () => {
  if (typeof Temporal === "undefined") await import("temporal-polyfill/global");
};
