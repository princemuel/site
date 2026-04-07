// SPDX-License-Identifier: Apache-2.0
import { secs } from "@repo/utils";
import { webfinger as buffer } from "../../assets/include";

export const GET = () => {
  return Response.json(buffer, {
    status: 200,
    headers: { "Cache-Control": `public, max-age=${secs({ days: 365 })}, immutable` },
  });
};
