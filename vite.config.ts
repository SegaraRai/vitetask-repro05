import { defineConfig } from "vite-plus";

export default defineConfig({
  run: {
    tasks: {
      "shim:cached": {
        command: "marker-cli shim-cached",
        cache: true,
      },
      "shim:cached-pathext": {
        command: "marker-cli shim-cached-pathext",
        cache: true,
        untrackedEnv: ["PATHEXT"],
      },
      "node:cached": {
        command: "node ./packages/marker-cli/bin/marker-cli.mjs node-cached",
        cache: true,
      },
      "shim:uncached": {
        command: "marker-cli shim-uncached",
        cache: false,
      },
    },
  },
});
