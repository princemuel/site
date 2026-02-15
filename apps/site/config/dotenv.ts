// SPDX-License-Identifier: Apache-2.0
import { envField } from "astro/config";
import { loadEnv } from "vite";

import type { AstroUserConfig } from "astro";

type Config = NonNullable<NonNullable<AstroUserConfig["env"]>["schema"]>;

const mode = process.env.NODE_ENV ?? "production";

const f = envField;
const str = f.string({ context: "server", access: "secret" });
const url = f.string({ context: "server", access: "secret", url: true });
const int = f.number({ context: "server", access: "secret", int: true });
const bool = f.boolean({ context: "server", access: "secret", default: false });

export const envSchema = {
  ASTRO_KEY: str,
  DATABASE_ENCRYPTION_KEY: str,
  DATABASE_TOKEN: str,
  DATABASE_URL: str,
  GOOGLE_DRIVE_TOKEN: str,
  GOOGLE_DRIVE_FILE_ID: str,
  OCTOKIT_TOKEN: str,
  OCTOKIT_URL: url,
  OCTOKIT_VERSION: str,
  OCTOKIT_REPO_OWNER: str,
  OCTOKIT_REPO_NAME: str,
  OCTOKIT_REPO_BRANCH: str,
  RESEND_ADDRESS: str,
  RESEND_AUDIENCE: str,
  RESEND_TOKEN: str,
  SENTRY_AUTH_TOKEN: str,
  SENTRY_DSN_URL: url,
  UPSTASH_REDIS_REST_TOKEN: str,
  UPSTASH_LIMIT_TOKEN: int,
  UPSTASH_LIMIT_WINDOW: str,
  UPSTASH_REDIS_REST_URL: url,
  USE_PARIALS: bool,
  WEBHOOK_SECRET: str,
  WAKATIME_TOKEN: str,
  OPENWEATHER_TOKEN: str,
} satisfies Config;
export const envVars = loadEnv(mode, process.cwd(), "");
