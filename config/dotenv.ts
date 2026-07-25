import type { AstroUserConfig } from "astro";
import { envField } from "astro/config";
import { loadEnv } from "vite";

type Config = NonNullable<NonNullable<AstroUserConfig["env"]>["schema"]>;

const mode = process.env.NODE_ENV ?? "production";

const { string, number, boolean } = envField;

const csas_str = string({ context: "server", access: "secret" });
const csas_url = string({ context: "server", access: "secret", url: true });
const csap_url = string({ context: "server", access: "public", url: true });
const csas_int = number({ context: "server", access: "secret", int: true });
const csas_bool = boolean({ context: "server", access: "secret", default: false });

export const envSchema = {
  ASTRO_KEY: csas_str,
  DATABASE_TOKEN: csas_str,
  DATABASE_URL: csas_url,
  GOOGLE_DRIVE_TOKEN: csas_str,
  GOOGLE_DRIVE_RESUME_NORMAL_ID: csas_str,
  GOOGLE_DRIVE_RESUME_FULL_ID: csas_str,
  GOOGLE_DRIVE_FILE_ID: csas_str,
  OCTOKIT_TOKEN: csas_str,
  OCTOKIT_URL: csas_url,
  OCTOKIT_VERSION: csas_str,
  OCTOKIT_REPO_OWNER: csas_str,
  OCTOKIT_REPO_NAME: csas_str,
  OCTOKIT_REPO_BRANCH: csas_str,
  PUBLIC_SITE_URL: csap_url,
  RATE_LIMIT_TOKENS: csas_int,
  RATE_LIMIT_WINDOW: csas_str,
  RESEND_ADDRESS: csas_str,
  RESEND_TOKEN: csas_str,
  RESEND_EMAIL: csas_str,
  USE_PARTIALS: csas_bool,
  UPSTASH_REDIS_REST_TOKEN: csas_str,
  UPSTASH_REDIS_REST_URL: csas_url,
} satisfies Config;

export const envVars = loadEnv(mode, process.cwd(), "");
