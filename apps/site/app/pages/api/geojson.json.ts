import { readFile } from "node:fs/promises";
import { join } from "node:path";

import type { APIRoute } from "astro";

const fileName = "ne_110m_admin_0_countries.geojson.json.br";
const filePath = join(process.cwd(), "app", "assets", "include", fileName);
const buffer = await readFile(filePath);

export const GET: APIRoute = async () => {
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/geo+json",
      "Content-Encoding": "br",
      "Cache-Control": "public, max-age=604800, immutable",
    },
  });
};
