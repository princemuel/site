import { GOOGLE_DRIVE_FILE_ID, GOOGLE_DRIVE_TOKEN } from "astro:env/server";
import { NotFoundError } from "http-errors-enhanced";

import type { APIRoute } from "astro";

/**
 * Fetches the resume PDF from Google Drive and returns it as a response.
 * The file is exported in PDF format and served with appropriate headers.
 */
export const GET: APIRoute = async () => {
  const mimeType = "application/pdf";
  const fileId = GOOGLE_DRIVE_FILE_ID;
  const apiKey = GOOGLE_DRIVE_TOKEN;

  const url = new URL(`https://www.googleapis.com/drive/v3/files/${fileId}/export`);
  url.searchParams.set("mimeType", mimeType);
  url.searchParams.set("key", apiKey);

  const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });

  if (!response.ok) throw new NotFoundError("Failed to fetch resource");

  return new Response(response.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=princemuel-resume",
      "Cache-Control": "public, max-age=604800, immutable",
      "Content-Length": response.headers.get("Content-Length") ?? "0",
    },
  });
};
