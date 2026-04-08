import { getCollection } from "astro:content";

import { omit, secs } from "@/utils";

import type { APIRoute, InferGetStaticParamsType, InferGetStaticPropsType } from "astro";

export async function getStaticPaths() {
  const entries = await getCollection(
    "problems",
    ({ data }) => !(import.meta.env.PROD && data.draft)
  );

  return entries.map((entry) => ({
    props: { entry },
    params: { slug: decodeURI(entry.id) },
  }));
}

type Props = InferGetStaticPropsType<typeof getStaticPaths>;
type Params = InferGetStaticParamsType<typeof getStaticPaths>;

export const GET: APIRoute<Props, Params> = async ({ props: { entry } }) => {
  const body = {
    ...omit(entry.data, ["draft", "extensions", "revisions", "date", "updated"]),
    ...entry.data.extensions,
  };
  return Response.json(body, {
    status: 200,
    headers: {
      "Content-Type": "application/problem+json",
      "Cache-Control": `public, max-age=${secs({ days: 365 })}, immutable`,
    },
  });
};
