#!/usr/bin/env node

import * as path from "node:path";
import { argv, cwd, exit } from "node:process";

const usage = () => {
  console.error(`Usage: node compress <input.json> [--out <outputBasePath>]
  - Compresses JSON using Gzip, Brotli, and Deflate.
  - Outputs: <outputBasePath>.gz, .br, .deflate`);
  exit(1);
};

const getArgs = () => {
  const args = argv.slice(2);
  if (args.length === 0) usage();

  const inputPath = path.resolve(cwd(), args[0]);
  const outFlagIndex = args.indexOf("--out");
  const outputPath =
    outFlagIndex !== -1 && args[outFlagIndex + 1] ? path.resolve(cwd(), args[outFlagIndex + 1]) : inputPath;

  return { inputPath, outputPath };
};
