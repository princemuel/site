// SPDX-License-Identifier: Apache-2.0
/// <reference types="vite-plugin-pwa/vanillajs" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference types="vite-plugin-pwa/pwa-assets" />
/// <reference types="../.astro/icon.d.ts" />

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare var Theme: ThemeController;
var __singletons__: Map<string, unknown> | undefined;

interface Window {
  [Symbol.for("app.theme")]: ThemeController;
}

declare namespace App {
  interface Locals extends Runtime {
    otherLocals: { test: string };
  }
}
