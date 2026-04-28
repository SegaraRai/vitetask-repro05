import { defineConfig } from "vite-plus";

export default defineConfig({
  run: {
    tasks: {
      "shim:cached": {
        command: "lingui --version",
        cache: true,
      },
      "node:cached": {
        command: "node ./node_modules/@lingui/cli/dist/lingui.js --version",
        cache: true,
      },
      "shim:uncached": {
        command: "lingui --version",
        cache: false,
      },
    },
  },
});
