import { RESEND_TOKEN } from "astro:env/server";
import { Resend } from "resend";

export const resend = new Resend(RESEND_TOKEN);

// https://github.com/octokit/octokit.js/#readme
// export const octokit = new Octokit({ auth: OCTOKIT_TOKEN });
