import { webfinger as buffer } from "../../assets/include";

export const GET = () => {
  return Response.json(buffer, {
    status: 200,
    headers: { "Cache-Control": "public, max-age=31536000, immutable" },
  });
};
