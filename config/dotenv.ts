import type { AstroUserConfig } from "astro";
import { envField } from "astro/config";
import { loadEnv } from "vite";

type Config = NonNullable<NonNullable<AstroUserConfig["env"]>["schema"]>;

const mode = process.env.NODE_ENV ?? "production";

const z = envField;
const s_str = z.string({ context: "server", access: "secret" });
const p_url = z.string({ context: "server", access: "public", url: true });
const s_url = z.string({ context: "server", access: "secret", url: true });
// const s_int = z.number({ context: "server", access: "secret", int: true });
const s_bool = z.boolean({ context: "server", access: "secret", default: false });

export const envSchema = {
  ASTRO_KEY: s_str,
  GOOGLE_DRIVE_TOKEN: s_str,
  GOOGLE_DRIVE_FILE_ID: s_str,
  OCTOKIT_TOKEN: s_str,
  OCTOKIT_URL: s_url,
  OCTOKIT_VERSION: s_str,
  OCTOKIT_REPO_OWNER: s_str,
  OCTOKIT_REPO_NAME: s_str,
  OCTOKIT_REPO_BRANCH: s_str,
  PUBLIC_SITE_URL: p_url,
  USE_PARTIALS: s_bool,
} satisfies Config;

export const envVars = loadEnv(mode, process.cwd(), "");
