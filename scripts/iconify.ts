#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";

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

const root = resolve(import.meta.dirname, "..");

const iconsJson = resolve(root, "app/assets/icons/icons.json");
const iconsDir = resolve(root, "app/assets/icons");
const outfile = resolve(root, "app/assets/icons/index.ts");
const manifestFile = resolve(root, "app/assets/icons/.icons-manifest.json");
const packageJson = resolve(root, "package.json");

type IconConfig = Record<string, string[]>;

interface Manifest {
  hash: string;
}

/**
 * Builds a single content hash over everything that can change this
 * script's output: the icon config, the resolved `@iconify-json/*`
 * dependency versions, and the local SVG files themselves.
 *
 * A hash beats comparing mtimes because mtimes are not preserved
 * reliably across `git clone`/CI checkouts/package installs, whereas
 * content is always correct regardless of how the files got there.
 */
async function computeInputsHash(iconConfig: IconConfig): Promise<string> {
  const hash = createHash("sha256");

  // 1. icons.json — hash the raw text so any whitespace-only diff
  // doesn't trigger a pointless rebuild, but any real change does.
  hash.update(JSON.stringify(iconConfig));

  // 2. @iconify-json/* dependency versions, sorted so key order in
  // package.json never changes the hash.
  const depVersions = await getIconifyDepVersions(Object.keys(iconConfig));
  for (const [name, version] of depVersions) hash.update(`${name}@${version}`);

  // 3. Local icon files — sorted by path, hash relative path + content
  // so a rename or content edit both register as changes.
  const localFiles = await hashLocalIconFiles(iconsDir);
  for (const [path, fileHash] of localFiles) hash.update(`${path}:${fileHash}`);

  return hash.digest("hex");
}

/**
 * Reads dependency version ranges for the requested @iconify-json/*
 * packages straight out of package.json. This assumes your declared
 * range (or exact version) is a faithful proxy for "did this change" —
 * true as long as you don't have a stale lockfile resolving to a
 * different version than what package.json declares.
 */
async function getIconifyDepVersions(setNames: string[]): Promise<[string, string][]> {
  const raw = await readFile(packageJson, "utf8");
  const pkg = JSON.parse(raw) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

  return setNames
    .map((name) => `@iconify-json/${name}`)
    .filter((pkgName) => pkgName in allDeps)
    .sort()
    .map((pkgName) => [pkgName, allDeps[pkgName]] as [string, string]);
}

/** Recursively hashes every file under `dir`, returning sorted [relativePath, hash] pairs. */
async function hashLocalIconFiles(dir: string): Promise<[string, string][]> {
  const results: [string, string][] = [];

  async function walk(current: string) {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.isFile()) {
        const content = await readFile(full);
        const fileHash = createHash("sha256").update(content).digest("hex");
        results.push([relative(dir, full), fileHash]);
      }
    }
  }

  await walk(dir);
  return results.sort(([a], [b]) => a.localeCompare(b));
}

async function readManifest(): Promise<Manifest | null> {
  try {
    const raw = await readFile(manifestFile, "utf8");
    return JSON.parse(raw) as Manifest;
  } catch {
    // Missing or corrupt manifest just means "treat as changed".
    return null;
  }
}

async function writeManifest(hash: string): Promise<void> {
  await mkdir(dirname(manifestFile), { recursive: true });
  await writeFile(manifestFile, JSON.stringify({ hash } satisfies Manifest, null, 2), "utf8");
}

async function hasUpdates(iconConfig: IconConfig): Promise<{ changed: boolean; hash: string }> {
  const currentHash = await computeInputsHash(iconConfig);
  const previous = await readManifest();
  return { changed: previous?.hash !== currentHash, hash: currentHash };
}

async function main() {
  const raw = await readFile(iconsJson, "utf8");
  const iconConfig = JSON.parse(raw) as IconConfig;

  const { changed, hash } = await hasUpdates(iconConfig);
  if (!changed) {
    console.log("[icons] No changes to icons.json, dependencies, or local icons. Skipping...");
    return;
  }

  const [iconifyCollections, localCollection] = await Promise.all([
    loadIconifyCollections(iconConfig),
    loadLocalCollection(iconsDir),
  ]);

  const all: Record<string, IconifyJSON> = {
    ...iconifyCollections,
    local: localCollection,
  };

  const iconNames = buildIconNames(all);

  const output = `\
// AUTO-GENERATED — do not edit manually
import type { getIcons } from "@iconify/utils";

type IconifyJSON = Parameters<typeof getIcons>[0];

export const iconNames = [${iconNames.map((name) => `\n\t"${name}"`).join(",")}
] as const;

export const icons: Record<string, IconifyJSON> = ${JSON.stringify(all, null, 2)};
 `;

  await mkdir(dirname(outfile), { recursive: true });
  await writeFile(outfile, output, "utf8");
  await writeManifest(hash);

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
        return null;
      }
      // "*" means entire set
      if (requested.length === 1 && requested[0] === "*") return [setName, collection] as const;
      const names = [...new Set(requested)];

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
  return Object.fromEntries(entries.filter(Boolean));
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
    } catch (error) {
      console.error(`[icons] Error processing local icon "${name}":`, error);
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
    case "hsl":
      return color.l === 0;
    case "lab":
    case "lch":
      return color.l === 0;
  }
  return false;
}

function isWhite(color: Color): boolean {
  switch (color.type) {
    case "rgb":
      return color.r === 255 && color.r === color.g && color.g === color.b;
    case "hsl":
      return color.l === 1;
    case "lab":
    case "lch":
      return color.l === 100;
  }
  return false;
}
