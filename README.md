# vitetask-repro05

Minimal repro for a Windows-specific `vite-task` cached execution issue.

The same CLI is run three ways:

- `lingui --version` with `cache: false`
- `node ./node_modules/@lingui/cli/dist/lingui.js --version` with `cache: true`
- `lingui --version` with `cache: true`

On Windows, the final case goes through the pnpm package binary shim:

```text
lingui.cmd -> powershell.exe -File lingui.ps1 -> node.exe .../lingui.js
```

Under cached `vp run` execution, that shim path may lose the inner Node process
output or fail to start the inner Node process with `0x800700e8`. The direct
Node CLI path is included as a control and should print the version.

## Manual Steps

```sh
pnpm install
pnpm check
```

The GitHub Actions workflow runs the same check on Linux and Windows.
