#!/usr/bin/env node
import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";

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

const iconsJson = path.resolve(root, "app/assets/icons/icons.json");
const iconsDir = path.resolve(root, "app/assets/icons");
const outfile = path.resolve(root, "app/assets/icons/index.ts");
const manifestFile = path.resolve(root, "app/assets/icons/manifest.json");
const packageJson = path.resolve(root, "package.json");

type IconConfig = Record<string, string[]>;

interface Manifest {
  hash: string;
  parts?: Record<string, string>;
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
async function computeInputsHash(
  iconConfig: IconConfig,
): Promise<{ combined: string; parts: Record<string, string> }> {
  // 1. icons.json  hash the raw text so any whitespace-only diff
  // doesn't trigger a pointless rebuild, but any real change does.
  const configHash = createHash("sha256").update(JSON.stringify(iconConfig)).digest("hex");

  // 2. @iconify-json/* dependency versions, sorted so key order in
  // package.json never changes the hash.
  const depVersions = await getIconifyDepVersions(Object.keys(iconConfig));
  const depsHash = createHash("sha256")
    .update(depVersions.map(([name, version]) => `${name}@${version}`).path.join("\n"))
    .digest("hex");

  // 3. Local icon files  sorted by path, hash relative path + content
  // so a rename or content edit both register as changes. Excludes
  // this script's own generated artifacts (see hashLocalIconFiles).
  const localFiles = await hashLocalIconFiles(iconsDir, new Set([outfile, manifestFile]));
  const filesHash = createHash("sha256")
    .update(localFiles.map(([path, fileHash]) => `${path}:${fileHash}`).path.join("\n"))
    .digest("hex");

  const combined = createHash("sha256")
    .update(configHash)
    .update(depsHash)
    .update(filesHash)
    .digest("hex");

  return { combined, parts: { config: configHash, deps: depsHash, files: filesHash } };
}

/**
 * Reads dependency version ranges for the requested @iconify-json/*
 * packages straight out of package.json. This assumes your declared
 * range (or exact version) is a faithful proxy for "did this change"
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
    .toSorted()
    .map((pkgName) => [pkgName, allDeps[pkgName]] as [string, string]);
}

/**
 * Runs `worker` over `items` with at most `limit` calls in flight at
 * once  i.e. a fixed-size pool draining a shared queue, not a naive
 * `Promise.all(items.map(worker))`.
 *
 * Unbounded fan-out is the wrong default once `items` can be large:
 * Node's libuv thread pool (used for fs operations) defaults to 4
 * threads, so firing off thousands of concurrent readFile calls just
 * means thousands of promises queuing behind the same 4 workers, plus
 * the overhead of having them all in flight (open file descriptors,
 * V8 promise bookkeeping) with zero extra throughput to show for it.
 * A small bounded pool gets the overlap that actually helps  disk
 * seek/read latency on one file hiding behind another's  without
 * the overhead of pretending concurrency is free.
 */
async function runPooled<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = Array.from({ length: items.length });
  let next = 0;

  async function runWorker() {
    while (next < items.length) {
      const index = (next += 1);
      results[index] = await worker(items[index]!);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, runWorker));
  return results;
}

/** SHA-256 of a file's contents via streaming, so memory use stays flat regardless of file size. */
async function hashFile(pathname: string): Promise<string> {
  const hash = createHash("sha256");
  await pipeline(createReadStream(pathname), hash);
  return hash.digest("hex");
}

/**
 * Walks `dir` and returns sorted [relativePath, hash] pairs for every
 * file found, excluding paths in `exclude`.
 *
 * Iterative and concurrent rather than recursive-and-sequential:
 * - Directory discovery fans out as soon as each `readdir` resolves
 *   instead of waiting for one subtree to finish before starting the
 *   next (the recursive `await walk(full)` version serializes sibling
 *   subtrees for no reason  they don't depend on each other).
 * - File hashing runs through a bounded pool (see `runPooled`) once
 *   every file in the tree has been discovered, so hashing overlaps
 *   across files instead of one-at-a-time.
 *
 * This trades a bit of readability for real wall-clock wins on
 * directories with many files or any non-trivial nesting  the
 * sequential recursive version pays disk latency once per file in
 * series, this pays it roughly once per `limit`-sized batch.
 */
async function hashLocalIconFiles(dir: string, exclude: Set<string>): Promise<[string, string][]> {
  const filePaths: string[] = [];
  const pendingDirs: Promise<void>[] = [];

  async function exploreDir(current: string): Promise<void> {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (exclude.has(full)) continue;

      if (entry.isDirectory()) {
        // Fire-and-collect: kick off this subtree's readdir immediately,
        // don't await it inline (that would serialize sibling subtrees).
        pendingDirs.push(exploreDir(full));
      } else if (entry.isFile()) {
        filePaths.push(full);
      }
    }
  }

  await exploreDir(dir);
  // exploreDir keeps queuing into pendingDirs as it discovers more
  // subdirectories, so drain repeatedly until nothing new appears
  // a single Promise.all(pendingDirs) would miss subtrees discovered
  // by the directories it's currently waiting on.
  while (pendingDirs.length > 0) {
    const batch = pendingDirs.splice(0);
    await Promise.all(batch);
  }

  const hashes = await runPooled(filePaths, 8, async (pathname) => {
    const fileHash = await hashFile(pathname);
    return [path.relative(dir, pathname), fileHash] as [string, string];
  });

  return hashes.toSorted(([a], [b]) => a.localeCompare(b));
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

async function writeManifest(hash: string, parts: Record<string, string>): Promise<void> {
  await mkdir(path.dirname(manifestFile), { recursive: true });
  await writeFile(manifestFile, JSON.stringify({ hash, parts } satisfies Manifest), "utf8");
}

async function hasUpdates(
  iconConfig: IconConfig,
): Promise<{ changed: boolean; hash: string; parts: Record<string, string> }> {
  const { combined, parts } = await computeInputsHash(iconConfig);
  const previous = await readManifest();

  if (process.env.ICONS_DEBUG) {
    console.log("[icons:debug] previous:", previous);
    console.log("[icons:debug] current parts:", parts);
    console.log("[icons:debug] current combined:", combined);
  }

  if (previous && previous.hash !== combined) {
    const prevParts = previous.parts ?? {};
    for (const key of Object.keys(parts)) {
      if (prevParts[key] !== parts[key]) {
        console.log(`[icons] change detected in: ${key}`);
      }
    }
  }

  return { changed: previous?.hash !== combined, hash: combined, parts };
}

async function main() {
  const raw = await readFile(iconsJson, "utf8");
  const iconConfig = JSON.parse(raw) as IconConfig;

  const { changed, hash, parts } = await hasUpdates(iconConfig);
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
// AUTO-GENERATED  do not edit manually
import type { getIcons } from "@iconify/utils";
type IconifyJSON = Parameters<typeof getIcons>[0];
export const iconNames = [${iconNames.map((name) => `"${name}"`).join(",")}
] as const;
export const icons: Record<string, IconifyJSON> = ${JSON.stringify(all)};
 `;

  await mkdir(path.dirname(outfile), { recursive: true });
  await writeFile(outfile, output, "utf8");
  await writeManifest(hash, parts);

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

      // @ts-expect-error this returns undefined
      collection = getIcons(collection, names);
      if (!collection) {
        console.warn(`[icons] "${setName}" failed to load the specified icons!`);
        return;
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
