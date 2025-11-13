import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async (ctx) => ctx.rewrite(new URL("/api/health.txt", ctx.site));
