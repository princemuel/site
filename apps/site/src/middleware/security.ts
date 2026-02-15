import type { MiddlewareHandler } from "astro";

export const secure_headers: MiddlewareHandler = async ({ request }, next) => {
  const response = await next();
  const r = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: new Headers(response.headers),
  });

  r.headers.set("X-Content-Type-Options", "nosniff");
  r.headers.set("X-Frame-Options", "DENY");
  r.headers.set("X-XSS-Protection", "1; mode=block");
  r.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  r.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // HSTS (consider removing if Netlify enforces it)
  if (request.url.startsWith("https:")) {
    r.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  return r;
};
