// SPDX-License-Identifier: Apache-2.0
import { omit } from "@/utils/object";
import { secs } from "@/utils/time";
import type { APIRoute, InferGetStaticParamsType, InferGetStaticPropsType } from "astro";
import { getCollection } from "astro:content";

export async function getStaticPaths() {
  const entries = await getCollection("problems", ({ data }) => !(import.meta.env.PROD && data.draft));

  return entries.map((entry) => ({
    props: { entry },
    params: { slug: decodeURI(entry.id) },
  }));
}

type Params = InferGetStaticParamsType<typeof getStaticPaths>;
type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute<Props, Params> = async ({ props: { entry } }) => {
  const body = { ...omit(entry.data, ["draft", "extensions"]), ...entry.data.extensions };
  return Response.json(body, {
    status: 200,
    headers: {
      "Content-Type": "application/problem+json",
      "Cache-Control": `public, max-age=${secs({ d: 365 })}, immutable`,
    },
  });
};
