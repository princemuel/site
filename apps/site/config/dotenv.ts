import { envField } from "astro/config";
import { loadEnv } from "vite";

import type { AstroUserConfig } from "astro";

type Config = NonNullable<NonNullable<AstroUserConfig["env"]>["schema"]>;

const v = envField;

const mode = process.env.NODE_ENV ?? "production";

const ss_str = v.string({ context: "server", access: "secret" });
const ss_url = v.string({ context: "server", access: "secret", url: true });
const ss_int = v.number({ context: "server", access: "secret", int: true });
const ss_bool = v.boolean({ context: "server", access: "secret", default: false });
const cp_url = v.string({ context: "client", access: "public", url: true });

export const envVars = loadEnv(mode, process.cwd(), "");
export const envSchema = {
  ASTRO_KEY: ss_str,

  DATABASE_ENCRYPTION_KEY: ss_str,
  DATABASE_TOKEN: ss_str,
  DATABASE_URL: ss_str,

  GOOGLE_DRIVE_TOKEN: ss_str,
  GOOGLE_DRIVE_FILE_ID: ss_str,

  OCTOKIT_TOKEN: ss_str,
  OCTOKIT_URL: ss_url,
  OCTOKIT_VERSION: ss_str,
  OCTOKIT_REPO_OWNER: ss_str,
  OCTOKIT_REPO_NAME: ss_str,
  OCTOKIT_REPO_BRANCH: ss_str,

  PUBLIC_SITE_URL: cp_url,

  RESEND_ADDRESS: ss_str,
  RESEND_AUDIENCE: ss_str,
  RESEND_TOKEN: ss_str,

  SENTRY_AUTH_TOKEN: ss_str,
  SENTRY_DSN_URL: ss_url,

  UPSTASH_REDIS_REST_TOKEN: ss_str,
  UPSTASH_LIMIT_TOKEN: ss_int,
  UPSTASH_LIMIT_WINDOW: ss_str,
  UPSTASH_REDIS_REST_URL: ss_url,

  USE_PARIALS: ss_bool,

  WEBHOOK_SECRET: ss_str,
  WAKATIME_TOKEN: ss_str,
} satisfies Config;
