import { cleanupSVG, importDirectory, isEmptyColor, parseColors, runSVGO } from "@iconify/tools";
import { getIcons } from "@iconify/utils";
import { loadCollectionFromFS } from "@iconify/utils/lib/loader/fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { SVG } from "@iconify/tools";
import type { IconifyJSON } from "@iconify/types";
import type { Color } from "@iconify/utils/lib/colors/types";
type SVGOOptions = Omit<NonNullable<Parameters<typeof runSVGO>[1]>, "keepShapes">;

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const ICONS_CONFIG = resolve(root, "src/assets/icons/icons.json");
const LOCAL_ICON_DIR = resolve(root, "src/assets/icons");
const ICONS_OUTPUT_FILE = resolve(root, "src/assets/icons/index.ts");
const TYPES_OUTPUT_FILE = resolve(root, ".astro/icon.d.ts");

type IconConfig = Record<string, string[]>;

async function main() {
  const raw = await readFile(ICONS_CONFIG, "utf-8");
  const iconConfig = JSON.parse(raw) as IconConfig;

  console.log("[icons] Loading collections...");

  const [iconifyCollections, localCollection] = await Promise.all([
    loadIconifyCollections(iconConfig),
    loadLocalCollection(LOCAL_ICON_DIR),
  ]);

  const all: Record<string, IconifyJSON> = {
    ...iconifyCollections,
    local: localCollection,
  };

  const { type: iconType, names: iconNames } = buildIconType(all);

  let output = `\
// AUTO-GENERATED — do not edit manually

declare module "virtual:iconify" {
  export type Icon = ${iconType};
}
 `;

  await mkdir(dirname(TYPES_OUTPUT_FILE), { recursive: true });
  await writeFile(TYPES_OUTPUT_FILE, output, "utf-8");

  output = `\
 // AUTO-GENERATED — do not edit manually

 import type { IconifyJSON } from "@iconify/types";

 export const iconNames = [${iconNames.map((name) => `\n\t"${name}"`).join(",")}
 ] as const;

 export const icons: Record<string, IconifyJSON> = ${JSON.stringify(all, null, 2)};
 `;

  await mkdir(dirname(ICONS_OUTPUT_FILE), { recursive: true });
  await writeFile(ICONS_OUTPUT_FILE, output, "utf-8");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

function buildIconType(collections: Record<string, IconifyJSON>, defaultPack = "local") {
  const names = Object.entries(collections).flatMap(([prefix, col]) => {
    const icons = Object.keys(col.icons);
    const aliases = Object.keys(col.aliases ?? {});
    return [...icons, ...aliases].map((name) =>
      prefix === defaultPack ? name : `${prefix}:${name}`,
    );
  });

  const type = names.length === 0 ? "never" : names.map((name) => `\n\t\t|\t"${name}"`).join("");
  return { type, names };
}

async function loadIconifyCollections(config: IconConfig) {
  const entries = await Promise.all(
    Object.entries(config).map(async ([setName, requested]) => {
      let collection = await loadCollectionFromFS(setName);
      if (!collection) {
        console.warn(`[icons] "${setName}" not found...is @iconify-json/${setName} installed?`);
        return null;
      }
      // "*" means entire set
      if (requested.length === 1 && requested[0] === "*") return [setName, collection] as const;
      const names = Array.from(new Set(requested));

      // @ts-expect-error this returns undefined
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
  return Object.fromEntries(entries.filter(Boolean) as [string, IconifyJSON][]);
}

async function loadLocalCollection(
  path: string,
  options: SVGOOptions = { plugins: ["preset-default"] },
) {
  const iconSet = await importDirectory(path, {
    prefix: "local",
    keepTitles: true,
    includeSubDirs: true,
    ignoreImportErrors: "warn",
    keyword: (file) => {
      const stem = file.file.replace(/\.local$/, "");
      return file.subdir ? `${file.subdir}${stem}` : stem;
    },
  });

  iconSet.forEachSync((name, type) => {
    if (type !== "icon") return;

    const svg = iconSet.toSVG(name);
    if (!svg) {
      iconSet.remove(name);
      return;
    }

    try {
      cleanupSVG(svg, { keepTitles: true });

      const mono = isMonochrome(svg);
      if (mono) convertToCurrentColor(svg);

      runSVGO(svg, options);
    } catch (err) {
      console.error(`[icons] Error processing local icon "${name}":`, err);
      iconSet.remove(name);
      return;
    }

    iconSet.fromSVG(name, svg);
  });

  return iconSet.export(true);
}

function convertToCurrentColor(svg: SVG): void {
  parseColors(svg, {
    defaultColor: "currentColor",
    callback: (_, colorStr, color) =>
      !color || isEmptyColor(color) || isWhite(color) ? colorStr : "currentColor",
  });
}

function isMonochrome(svg: SVG): boolean {
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

function isBlack(color: Color): boolean {
  switch (color.type) {
    case "rgb":
      return color.r === 0 && color.r === color.g && color.g === color.b;
  }
  return false;
}

function isWhite(color: Color): boolean {
  switch (color.type) {
    case "rgb":
      return color.r === 255 && color.r === color.g && color.g === color.b;
  }
  return false;
}
