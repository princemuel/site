import { envField } from "astro/config";
import { loadEnv } from "vite";

import type { AstroUserConfig } from "astro";

type Config = NonNullable<NonNullable<AstroUserConfig["env"]>["schema"]>;

const v = envField;

const mode = process.env.NODE_ENV ?? "production";

const server_secret_str = v.string({ context: "server", access: "secret" });
const server_secret_url = v.string({ context: "server", access: "secret", url: true });
const server_secret_int = v.number({ context: "server", access: "secret", int: true });
const server_secret_bool = v.boolean({ context: "server", access: "secret", default: false });
const client_public_url = v.string({ context: "client", access: "public", url: true });

export const envVars = loadEnv(mode, process.cwd(), "");
export const envSchema = {
  ASTRO_KEY: server_secret_str,

  DATABASE_ENCRYPTION_KEY: server_secret_str,
  DATABASE_TOKEN: server_secret_str,
  DATABASE_URL: server_secret_str,

  GOOGLE_DRIVE_TOKEN: server_secret_str,
  GOOGLE_DRIVE_FILE_ID: server_secret_str,

  OCTOKIT_TOKEN: server_secret_str,
  OCTOKIT_URL: server_secret_url,
  OCTOKIT_VERSION: server_secret_str,
  OCTOKIT_REPO_OWNER: server_secret_str,
  OCTOKIT_REPO_NAME: server_secret_str,
  OCTOKIT_REPO_BRANCH: server_secret_str,

  PUBLIC_SITE_URL: client_public_url,

  RESEND_ADDRESS: server_secret_str,
  RESEND_AUDIENCE: server_secret_str,
  RESEND_TOKEN: server_secret_str,

  WEBHOOK_SECRET: server_secret_str,

  SENTRY_AUTH_TOKEN: server_secret_str,
  SENTRY_DSN_URL: server_secret_url,

  SITE_LIVE: server_secret_bool,
  SITE_STATUS: v.enum({
    access: "secret",
    context: "server",
    values: [
      "construction",
      "development",
      "beta",
      "maintenance",
      "emergency",
      "security",
      "upgrade",
      "migration",
      "deployment",
      "outage",
      "database",
      "network",
      "holiday",
      "weekend",
      "redesign",
      "content",
      "legal",
      "gdpr",
      "custom",
    ],
    optional: true,
  }),

  UPSTASH_REDIS_REST_TOKEN: server_secret_str,
  UPSTASH_LIMIT_TOKEN: server_secret_int,
  UPSTASH_LIMIT_WINDOW: server_secret_str,
  UPSTASH_REDIS_REST_URL: server_secret_url,

  WAKATIME_TOKEN: server_secret_str,
} satisfies Config;
