// SPDX-License-Identifier: Apache-2.0
import * as Sentry from "@sentry/astro";
import * as Spotlight from "@spotlightjs/spotlight";

const isProd = process.env.NODE_ENV !== "development";

Sentry.init({
  dsn: "https://6b6896649eefeae398f66bd56d9d879e@o4505133438533632.ingest.us.sentry.io/4508977534009344",
  sendDefaultPii: true,
  integrations: [Sentry.replayIntegration()],
  // Session Replay
  replaysSessionSampleRate: !isProd ? 1 : 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});
Spotlight.init();
