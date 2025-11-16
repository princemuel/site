import { GOOGLE_DRIVE_FILE_ID, GOOGLE_DRIVE_TOKEN } from "astro:env/server";
import { NotFoundError } from "http-errors-enhanced";

import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  try {
    const mimeType = "application/pdf";
    const fileId = GOOGLE_DRIVE_FILE_ID;

    const url = new URL(`https://www.googleapis.com/drive/v3/files/${fileId}/export`);
    url.searchParams.set("mimeType", mimeType);
    url.searchParams.set("key", GOOGLE_DRIVE_TOKEN);

    const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
    if (!response.ok || !response.body) throw new NotFoundError("Failed to fetch resource");

    return new Response(response.body, {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": "inline; filename=princemuel-resume",
        "Cache-Control": "public, max-age=604800, immutable",
        "Content-Length": response.headers.get("Content-Length") ?? "0",
      },
    });
  } catch {
    return new Response(null);
  }
};
