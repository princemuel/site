import { webfinger as buffer } from "../../assets/include";
import { secs } from "../../utils";

export const GET = () => {
  return Response.json(buffer, {
    status: 200,
    headers: { "Cache-Control": `public, max-age=${secs({ days: 365 })}, immutable` },
  });
};
