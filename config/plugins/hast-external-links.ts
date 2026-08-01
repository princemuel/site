import { envVars } from "../dotenv";
import type { HastPlugin } from "./types";

interface ExternalLinkAttrs {
  href: string;
  target?: string;
  rel?: string;
  "data-astro-prefetch"?: "true";
}

export const hast_external_links: HastPlugin = {
  name: "hast-external-links",
  element: {
    filter: ["a"],
    visit(node, ctx) {
      const { href } = node.properties;
      if (typeof href === "string") {
        const isInternal = ["/", "#"].some((str) => href.startsWith(str));
        const attrs: ExternalLinkAttrs = isInternal
          ? {
              href: new URL(href, envVars.PUBLIC_SITE_URL).toString(),
              "data-astro-prefetch": "true",
            }
          : { href, target: "_blank", rel: "noopener noreferrer external" };
        for (const [key, value] of Object.entries(attrs)) ctx.setProperty(node, key, value);
      }
    },
  },
};
