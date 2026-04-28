import { spawnSync } from "node:child_process";
import process from "node:process";

const EXPECTED_VERSION = "6.0.0";

function run(args) {
  const result = spawnSync("vp", args, {
    encoding: "utf8",
    shell: process.platform === "win32",
  });

  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  process.stdout.write(`\n> vp ${args.join(" ")}\n`);
  process.stdout.write(output);

  if (result.status !== 0) {
    throw new Error(`vp ${args.join(" ")} exited with ${result.status}`);
  }

  return output;
}

function assertIncludes(output, expected, label) {
  if (!output.includes(expected)) {
    throw new Error(`${label} did not include ${JSON.stringify(expected)}`);
  }
}

run(["cache", "clean"]);

const uncachedShim = run(["run", "shim:uncached"]);
assertIncludes(uncachedShim, EXPECTED_VERSION, "uncached package shim");

run(["cache", "clean"]);

const cachedNode = run(["run", "node:cached"]);
assertIncludes(cachedNode, EXPECTED_VERSION, "cached direct node CLI");

run(["cache", "clean"]);

const cachedShim = run(["run", "shim:cached"]);
assertIncludes(cachedShim, EXPECTED_VERSION, "cached package shim");
