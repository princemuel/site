import { fontData } from "astro:assets";

import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { html } from "satori-html";

import type { APIRoute } from "astro";

// const markup = html`<div
//   tw="flex h-full w-full items-center justify-center bg-black text-white"
// >
//   <h1 tw="text-5xl font-bold">Hello, world</h1>
// </div>`;

// https://github.com/vercel/satori#css
// https://github.com/vercel/satori/blob/main/app/handler/presets.ts
// https://vercel.com/docs/og-image-generation/examples?framework=other#dynamic-title

export const GET: APIRoute = async (ctx) => {
  const data = fontData["--font-family-sans"];

  const fontSrc = data[0]?.src?.find((src) => /^(ttf|woff)$/i.test(src?.format ?? ""));
  if (!fontSrc) return new Response(null, { status: 404 });

  const node = html`<div tw="flex h-full w-full flex-col bg-white p-16 font-sans">
    <div tw="flex items-start justify-between">
      <span tw="text-sm tracking-widest text-blue-500 uppercase">${ctx.url.hostname}</span>
      <span tw="text-sm font-light text-zinc-400">March 2025</span>
    </div>

    <div tw="my-auto flex flex-1 flex-col items-center justify-center">
      <h1 tw="max-w-3xl text-center text-5xl leading-tight font-light text-zinc-900">Title</h1>
    </div>

    <div tw="flex items-end justify-between">
      <p tw="flex items-center">
        <span tw="text-base font-light text-zinc-700">Author Name</span>
        <span tw="mx-2 text-zinc-300">•</span>
        <span tw="text-base font-light text-zinc-500">Tag</span>
      </p>
      <span tw="text-base font-light text-zinc-500">6 min read</span>
    </div>
  </div>`;

  //@ts-expect-error satori-html type (VNode) does not match satori's type (React.ReactNode)
  const svg = await satori(node, {
    width: 600,
    height: 400,
    fonts: [
      {
        name: "Sen",
        style: "normal",
        data: await fetch(new URL(fontSrc.url, ctx.url.origin)).then((res) => res.arrayBuffer()),
      },
    ],
  });

  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 600 } });
  const buffer = resvg.render().asPng();

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
