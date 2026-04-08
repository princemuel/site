import { GOOGLE_DRIVE_FILE_ID, GOOGLE_DRIVE_TOKEN } from "astro:env/server";

import { secs } from "@/utils";

import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  try {
    const fileId = GOOGLE_DRIVE_FILE_ID;
    const baseUrl = new URL("https://www.googleapis.com/drive/v3/");

    const url = new URL(`files/${fileId}/export`, baseUrl);
    url.searchParams.set("mimeType", "application/pdf");
    url.searchParams.set("key", GOOGLE_DRIVE_TOKEN);

    const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
    if (!response.ok) return new Response(null, { status: 404 });

    const body = await response.arrayBuffer();
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=princemuel-resume.pdf",
        "Cache-Control": `public, max-age=${secs({ hours: 1 })}, stale-while-revalidate=${secs({ days: 1 })}`,
        "Content-Length": body.byteLength.toString(),
      },
    });
  } catch (e) {
    const error = e as Error;
    const status = error.name === "TimeoutError" ? 504 : error.name === "AbortError" ? 499 : 500;
    return new Response(null, { status });
  }
  // https://docs.google.com/document/d/1GzPJTAng3bG25ZX8OMnt7A_OlsNxAXIYXwQM5QrJTlg/edit?usp=drive_link
};
// https://docs.google.com/document/d/1GzPJTAng3bG25ZX8OMnt7A_OlsNxAXIYXwQM5QrJTlg/edit?usp=sharing
// https://docs.google.com/document/d/1GzPJTAng3bG25ZX8OMnt7A_OlsNxAXIYXwQM5QrJTlg/edit?usp=sharing
