import type { APIRoute, InferGetStaticParamsType, InferGetStaticPropsType } from "astro";
import { getCollection } from "astro:content";

import { isPublished } from "@/content/helpers";
import { omit } from "@/utils/object";
import { toSeconds } from "@/utils/time";

export const getStaticPaths = async () => {
  const entries = await getCollection("problems", ({ data }) => isPublished(data.published));

  return entries.map((entry) => ({
    props: { entry },
    params: { slug: decodeURI(entry.id) },
  }));
};

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
      "Cache-Control": `public, max-age=${toSeconds({ days: 365 })}, immutable`,
    },
  });
};
