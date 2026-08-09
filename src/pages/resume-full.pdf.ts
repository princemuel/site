// oxlint-disable no-nested-ternary
import type { APIRoute } from "astro";
import { GOOGLE_DRIVE_RESUME_FULL_ID } from "astro:env/server";

import { toSecs } from "@/utils/time";

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const base = "https://docs.google.com";
    const url = new URL(`/document/d/${GOOGLE_DRIVE_RESUME_FULL_ID}/export`, base);
    url.searchParams.set("format", "pdf");

    const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    if (!response.ok) return new Response(null, { status: 404 });

    const body = await response.arrayBuffer();
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=princemuel-resume.pdf",
        "Cache-Control": `public, max-age=${toSecs({ days: 1 })}, stale-while-revalidate=${toSecs({ days: 3 })}`,
        "Content-Length": body.byteLength.toString(),
      },
    });
  } catch (e) {
    const error = e as Error;
    const status =
      error.name === "TimeoutError" ? 504 : error.name === "AbortError" ? 499 : 500;
    return new Response(null, { status });
  }
};
