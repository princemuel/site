import { webfinger as buffer } from "../../assets/include";
import { toSecs } from "../../utils/time";

export const GET = () =>
  Response.json(buffer, {
    status: 200,
    headers: { "Cache-Control": `public, max-age=${toSecs({ days: 365 })}, immutable` },
  });
