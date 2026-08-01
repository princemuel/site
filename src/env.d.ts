/// <reference types="vite-plugin-pwa/vanillajs" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference types="vite-plugin-pwa/pwa-assets" />
/// <reference types="../.astro/icon.d.ts" />
/// <reference types="./@types/custom-elements.d.ts" />

declare var Theme: ThemeController;
var __singletons__: Map<string, unknown> | undefined;

const __BUILD_TIME__: string;
const __DEPLOY_CHANNEL__: string;
const __COMMIT_SHA__: string;
const __UUID_NAMESPACE__: string;

declare namespace App {
  interface Locals {
    timeZone: Intl.ResolvedDateTimeFormatOptions["timeZone"];
    locale: Intl.ResolvedDateTimeFormatOptions["locale"];
    greeting: string;
    content: { title: string; description: string };
    auth: { start_time: number };
    ratelimit: { limit: number; remaining: number; reset: number; throttle: boolean };
    botinfo: { blocked: boolean; isMissingUA: boolean; isBot: boolean };
  }
}
