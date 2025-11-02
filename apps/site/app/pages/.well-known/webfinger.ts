export const GET = () =>
  Response.json(data, {
    status: 200,
    headers: { "Cache-Control": "public, max-age=31536000, immutable" },
  });
