// SPDX-License-Identifier: Apache-2.0
import { GOOGLE_DRIVE_FILE_ID, GOOGLE_DRIVE_TOKEN } from "astro:env/server";

import { secs } from "@/utils/time";
import type { APIRoute } from "astro";
import { NotFoundError } from "http-errors-enhanced";

export const GET: APIRoute = async () => {
  try {
    const fileId = GOOGLE_DRIVE_FILE_ID;
    const baseUrl = new URL("https://www.googleapis.com/drive/v3/");

    const url = new URL(`files/${fileId}/export`, baseUrl);
    url.searchParams.set("mimeType", "application/pdf");
    url.searchParams.set("key", GOOGLE_DRIVE_TOKEN);

    const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });

    if (!response.ok) throw new NotFoundError("Failed to fetch resource");

    const body = await response.arrayBuffer();
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=princemuel-resume.pdf",
        "Cache-Control": `public, max-age=${secs({ h: 1 })}, stale-while-revalidate=${secs({ d: 1 })}`,
        "Content-Length": body.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("Resume fetch error:", error);
    return new Response(null, { status: 500 });
  }
  // https://docs.google.com/document/d/1GzPJTAng3bG25ZX8OMnt7A_OlsNxAXIYXwQM5QrJTlg/edit?usp=drive_link
};
// https://docs.google.com/document/d/1GzPJTAng3bG25ZX8OMnt7A_OlsNxAXIYXwQM5QrJTlg/edit?usp=sharing
// https://docs.google.com/document/d/1GzPJTAng3bG25ZX8OMnt7A_OlsNxAXIYXwQM5QrJTlg/edit?usp=sharing
