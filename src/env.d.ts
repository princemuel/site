// oxlint-disable no-underscore-dangle init-declarations
/// <reference types="vite-plugin-pwa/vanillajs" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference types="vite-plugin-pwa/pwa-assets" />
/// <reference types="../.astro/icon.d.ts" />
/// <reference types="./@types/custom-elements.d.ts" />

declare var Theme: ThemeController;
var __singletons__: Map<string, unknown> | undefined;

var __BUILD_TIME__: string;
var __DEPLOY_CHANNEL__: string;
var __COMMIT_SHA__: string;
var __UUID_NAMESPACE__: string;

interface RateLimitResult {
  limit: number;
  remaining: number;
  reset: Temporal.Instant;
  throttle: boolean;
}

declare namespace App {
  interface Locals {
    timeZone: Intl.ResolvedDateTimeFormatOptions["timeZone"];
    locale: Intl.ResolvedDateTimeFormatOptions["locale"];
    greeting: string;
    content: { title: string; description: string };
    auth: { start_time: number };
    ratelimit: RateLimitResult;
    botinfo: { blocked: boolean; isMissingUA: boolean; isBot: boolean };
  }
}
