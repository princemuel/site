import type { APIRoute } from "astro";

export const GET: APIRoute = async (ctx) => {
  const body = `
# I, for one, welcome our new robotic overlords

User-Agent: *
Allow: /
Disallow: /api/*

Sitemap: ${new URL("sitemap-index.xml", ctx.site)}
  `.trim();

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=UTF-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
