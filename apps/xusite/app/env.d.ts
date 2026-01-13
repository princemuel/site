// SPDX-License-Identifier: Apache-2.0
/// <reference types="vite-plugin-pwa/vanillajs" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference types="vite-plugin-pwa/pwa-assets" />
/// <reference types="../.astro/icon.d.ts" />

declare var Theme: ThemeController;
var __singletons__: Map<string, unknown> | undefined;
type NetlifyLocals = import("@astrojs/netlify").NetlifyLocals;

declare namespace App {
  interface Locals extends NetlifyLocals {
    content_slot: { title: string; description: string };
    auth: { start_time: number };
    ratelimit: { limit: number; remaining: number; reset: number; throttle: boolean };
    botinfo: { blocked: boolean; isMissingUA: boolean; isBot: boolean };
  }
}
