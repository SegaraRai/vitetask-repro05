import { spawnSync } from "node:child_process";
import process from "node:process";

const CASES = [
  ["shim:uncached", "shim-uncached"],
  ["node:cached", "node-cached"],
  ["shim:cached-pathext", "shim-cached-pathext"],
  ["shim:cached", "shim-cached"],
];

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

function assertIncludes(output, label) {
  const expected = `MARKER_STDOUT:${label}`;
  if (!output.includes(expected)) {
    throw new Error(`task output did not include ${JSON.stringify(expected)}`);
  }
}

for (const [task, label] of CASES) {
  run(["cache", "clean"]);
  const output = run(["run", task]);
  assertIncludes(output, label);
}
