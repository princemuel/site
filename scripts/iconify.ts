#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  cleanupSVG,
  importDirectory,
  isEmptyColor,
  parseColors,
  runSVGO,
  type SVG,
} from "@iconify/tools";
import { getIcons } from "@iconify/utils";
import type { Color } from "@iconify/utils/lib/colors/types";
import { loadCollectionFromFS } from "@iconify/utils/lib/loader/fs";

type IconifyJSON = Parameters<typeof getIcons>[0];
type SVGOOptions = Omit<NonNullable<Parameters<typeof runSVGO>[1]>, "keepShapes">;

const root = path.resolve(import.meta.dirname, "..");
const iconsPath = "src/assets/media/icons";
const iconsDir = path.resolve(root, iconsPath);
const iconsManifest = path.resolve(root, `${iconsPath}/manifest.json`);
const iconsOutfile = path.resolve(root, `${iconsPath}/index.ts`);

type IconConfig = Record<string, string[]>;

async function main() {
  const raw = await readFile(iconsManifest, "utf8");
  const iconConfig = JSON.parse(raw) as IconConfig;

  const [iconifyCollections, localCollection] = await Promise.all([
    loadIconifyCollections(iconConfig),
    loadLocalCollection(iconsDir),
  ]);

  const all = Object.fromEntries(
    Object.entries({
      ...iconifyCollections,
      local: localCollection,
    } as Record<string, IconifyJSON>).map(([key, json]) => {
      delete json.lastModified;
      return [key, json];
    }),
  );

  const iconNames = buildIconNames(all);

  const output = `\
// AUTO-GENERATED do not edit manually
import type { getIcons } from "@iconify/utils";
type IconifyJSON = Parameters<typeof getIcons>[0];
export const iconNames = [${iconNames.map((name) => `"${name}"`).join(",")}
] as const;
export const icons: Record<string, IconifyJSON> = ${JSON.stringify(all)};
`;

  await mkdir(path.dirname(iconsOutfile), { recursive: true });
  await writeFile(iconsOutfile, output, "utf8");

  console.log("[icons] icon collections generated successfully");
}

try {
  await main();
} catch (error) {
  console.error(error);
  process.exit(1);
}

function buildIconNames(collections: Record<string, IconifyJSON>, defaultPack = "local") {
  return Object.entries(collections).flatMap(([prefix, col]) =>
    [...Object.keys(col.icons), ...Object.keys(col.aliases ?? {})].map((name) =>
      prefix === defaultPack ? name : `${prefix}:${name}`,
    ),
  );
}

async function loadIconifyCollections(config: IconConfig) {
  const entries = await Promise.all(
    Object.entries(config).map(async ([setName, requested]) => {
      let collection = await loadCollectionFromFS(setName);
      if (!collection) {
        console.warn(`[icons] "${setName}" not found...is @iconify-json/${setName} installed?`);
        return;
      }
      // "*" means entire set
      if (requested.length === 1 && requested[0] === "*") return [setName, collection] as const;
      const names = [...new Set(requested)];

      // @ts-expect-error Type 'IconifyJSON | null' is not assignable to type 'IconifyJSON | undefined'
      collection = getIcons(collection, names);
      if (!collection) {
        console.warn(`[icons] "${setName}" failed to load the specified icons!`);
        return null;
      }

      const missing = names.filter((name) => !(name in collection.icons));
      if (missing.length > 0) {
        console.warn(`[icons] "${setName}" missing icons: ${missing.join(", ")}`);
      }

      return [setName, collection] as const;
    }),
  );
  return Object.fromEntries(entries.filter(Boolean));
}

async function loadLocalCollection(
  dir: string,
  options: SVGOOptions = { plugins: ["preset-default"] },
) {
  const iconSet = await importDirectory(dir, {
    prefix: "local",
    keepTitles: true,
    includeSubDirs: true,
    ignoreImportErrors: "warn",
    keyword: (file) => {
      const stem = file.file.replace(/\.local$/u, "");
      return file.subdir ? `${file.subdir}${stem}` : stem;
    },
  });

  void iconSet.forEach((name, type) => {
    if (type !== "icon") return;

    const svg = iconSet.toSVG(name);
    if (!svg) {
      iconSet.remove(name);
      return false;
    }

    try {
      cleanupSVG(svg, { keepTitles: true });

      if (isMonochrome(svg)) convertToCurrentColor(svg);

      runSVGO(svg, options);
    } catch (error) {
      console.error(`[icons] Error processing local icon "${name}":`, error);
      iconSet.remove(name);
      return false;
    }

    iconSet.fromSVG(name, svg);
  });

  return iconSet.export(true);
}

function convertToCurrentColor(svg: SVG) {
  parseColors(svg, {
    defaultColor: "currentColor",
    callback: (_, colorStr, color) =>
      !color || isEmptyColor(color) || isWhite(color) ? colorStr : "currentColor",
  });
}

function isMonochrome(svg: SVG) {
  let monochrome = true;
  parseColors(svg, {
    defaultColor: "currentColor",
    callback: (_, colorStr, color) => {
      monochrome &&= !color || isEmptyColor(color) || isWhite(color) || isBlack(color);
      return colorStr;
    },
  });

  return monochrome;
}

function isBlack(color: Color) {
  // oxlint-disable-next-line typescript/switch-exhaustiveness-check
  switch (color.type) {
    case "rgb": {
      return color.r === 0 && color.r === color.g && color.g === color.b;
    }
    case "hsl": {
      return color.l === 0;
    }
    case "lab":
    case "lch": {
      return color.l === 0;
    }
  }
  return false;
}

function isWhite(color: Color) {
  // oxlint-disable-next-line typescript/switch-exhaustiveness-check
  switch (color.type) {
    case "rgb": {
      return color.r === 255 && color.r === color.g && color.g === color.b;
    }
    case "hsl": {
      return color.l === 1;
    }
    case "lab":
    case "lch": {
      return color.l === 100;
    }
  }
  return false;
}
