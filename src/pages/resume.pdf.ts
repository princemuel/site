// oxlint-disable no-nested-ternary
import type { APIRoute } from "astro";
import { GOOGLE_DRIVE_FILE_ID, GOOGLE_DRIVE_TOKEN } from "astro:env/server";

import { toSecs } from "@/utils/time";

export const GET: APIRoute = async () => {
  try {
    const baseUrl = new URL("https://www.googleapis.com/drive/v3/");

    const url = new URL(`files/${GOOGLE_DRIVE_FILE_ID}/export`, baseUrl);
    url.searchParams.set("mimeType", "application/pdf");
    url.searchParams.set("key", GOOGLE_DRIVE_TOKEN);

    const response = await fetch(url, { signal: AbortSignal.timeout(60_000) });
    if (!response.ok) return new Response(undefined, { status: 404 });

    const body = await response.arrayBuffer();
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=resume-princemuel.pdf",
        "Cache-Control": `public, max-age=${toSecs({ hours: 12 })}, stale-while-revalidate=${toSecs({ days: 1 })}`,
        "Content-Length": body.byteLength.toString(),
      },
    });
  } catch (e) {
    const error = e as Error;
    const status =
      error.name === "TimeoutError" ? 504 : error.name === "AbortError" ? 499 : 500;
    return new Response(undefined, { status });
  }
  // https://docs.google.com/document/d/1GzPJTAng3bG25ZX8OMnt7A_OlsNxAXIYXwQM5QrJTlg/edit?usp=drive_link
};
// https://docs.google.com/document/d/1GzPJTAng3bG25ZX8OMnt7A_OlsNxAXIYXwQM5QrJTlg/edit?usp=sharing
// https://docs.google.com/document/d/1GzPJTAng3bG25ZX8OMnt7A_OlsNxAXIYXwQM5QrJTlg/edit?usp=sharing
