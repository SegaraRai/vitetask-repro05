#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const label = process.argv[2] ?? "missing-label";
const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = resolve(packageRoot, "..", "..");
const markerDir = resolve(workspaceRoot, ".markers");
const markerPath = resolve(markerDir, `${label}.json`);
const payload = {
  label,
  argv: process.argv,
  cwd: process.cwd(),
  execPath: process.execPath,
  pid: process.pid,
  time: new Date().toISOString(),
};

mkdirSync(markerDir, { recursive: true });
writeFileSync(markerPath, `${JSON.stringify(payload, null, 2)}\n`);

console.log(`MARKER_STDOUT:${label}`);
