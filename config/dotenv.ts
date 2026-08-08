import type { AstroUserConfig } from "astro";
import { envField } from "astro/config";
import { loadEnv } from "vite";

type Config = NonNullable<NonNullable<AstroUserConfig["env"]>["schema"]>;

const mode = process.env.NODE_ENV ?? "production";

const env = envField;
const csas_str = env.string({ context: "server", access: "secret" });
const csas_url = env.string({ context: "server", access: "secret", url: true });
const csap_url = env.string({ context: "server", access: "public", url: true });
// Const s_int = z.number({ context: "server", access: "secret", int: true });
const csas_bool = env.boolean({ context: "server", access: "secret", default: false });

export const envSchema = {
  ASTRO_KEY: csas_str,
  DATABASE_TOKEN: csas_str,
  DATABASE_URL: csas_url,
  GOOGLE_DRIVE_TOKEN: csas_str,
  GOOGLE_DRIVE_FILE_ID: csas_str,
  OCTOKIT_TOKEN: csas_str,
  OCTOKIT_URL: csas_url,
  OCTOKIT_VERSION: csas_str,
  OCTOKIT_REPO_OWNER: csas_str,
  OCTOKIT_REPO_NAME: csas_str,
  OCTOKIT_REPO_BRANCH: csas_str,
  PUBLIC_SITE_URL: csap_url,
  RESEND_ADDRESS: csas_str,
  RESEND_TOKEN: csas_str,
  RESEND_EMAIL: csas_str,
  USE_PARTIALS: csas_bool,
} satisfies Config;

export const envVars = loadEnv(mode, process.cwd(), "");
