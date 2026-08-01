import { webfinger as buffer } from "../../assets/include";
import { toSeconds } from "../../utils/time";

export const GET = () =>
  Response.json(buffer, {
    status: 200,
    headers: { "Cache-Control": `public, max-age=${toSeconds({ days: 365 })}, immutable` },
  });
