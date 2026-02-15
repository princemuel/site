// SPDX-License-Identifier: Apache-2.0
/// <reference types="vite-plugin-pwa/vanillajs" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference types="vite-plugin-pwa/pwa-assets" />
/// <reference types="../.astro/icon.d.ts" />

declare var Theme: ThemeController;
var __singletons__: Map<string, unknown> | undefined;
type RuntimeLocals = import("@astrojs/cloudflare").Runtime;

declare namespace App {
  interface Locals extends RuntimeLocals {
    content: { title: string; description: string };
    auth: { start_time: number };
    ratelimit: { limit: number; remaining: number; reset: number; throttle: boolean };
    botinfo: { blocked: boolean; isMissingUA: boolean; isBot: boolean };
  }
}
