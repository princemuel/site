#!/usr/bin/env node

import * as fs from "node:fs";
import * as path from "node:path";
import * as zlib from "node:zlib";

const usage = () => {
  console.error(`Usage: node compress <input.json> [--out <outputBasePath>]
  - Compresses JSON using Gzip, Brotli, and Deflate.
  - Outputs: <outputBasePath>.gz, .br, .deflate`);
  process.exit(1);
};

const getArgs = () => {
  const args = process.argv.slice(2);
  if (args.length === 0) usage();

  const inputPath = path.resolve(process.cwd(), args[0]);
  const outFlagIndex = args.indexOf("--out");
  const outputPath =
    outFlagIndex !== -1 && args[outFlagIndex + 1]
      ? path.resolve(process.cwd(), args[outFlagIndex + 1])
      : inputPath;

  return { path: { input: inputPath, output: outputPath } };
};

/**
 * @param {number} bytes
 */
const formatSize = (bytes) => `${(bytes / 1024).toFixed(2)} KiB`;

/**
 *
 * @param {unknown} jsonData
 * @param {string} basePath
 */
const compressJson = async (jsonData, basePath) => {
  const minified = JSON.stringify(jsonData);
  const buffer = Buffer.from(minified, "utf8");

  const compressions = {
    gzip: zlib.gzipSync(buffer, { level: zlib.constants.Z_BEST_COMPRESSION }),
    // deflate: zlib.deflateSync(buffer, { level: zlib.constants.Z_BEST_COMPRESSION }),
    brotli: zlib.brotliCompressSync(buffer, {
      params: { [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY },
    }),
  };

  console.log(`ORIGINAL: ${formatSize(buffer.length)}`);

  await Promise.all(
    Object.entries(compressions).map(async ([type, data]) => {
      const ratio = ((data.length / buffer.length) * 100).toFixed(1);
      const outPath = `${basePath}.${type === "brotli" ? "br" : type}`;

      await fs.promises.writeFile(outPath, data);

      console.log(
        `${type.toUpperCase()}: ${formatSize(data.length)} (${ratio}% of original) → ${outPath}`,
      );
    }),
  );
};

const main = async () => {
  const { path } = getArgs();

  if (!fs.existsSync(path.input)) {
    console.error(`❌ Input file not found: ${path.input}`);
    process.exit(1);
  }

  try {
    const content = await fs.promises.readFile(path.input, "utf8");
    const json = JSON.parse(content);
    await compressJson(json, path.output);
  } catch (error) {
    // @ts-expect-error
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

main();
