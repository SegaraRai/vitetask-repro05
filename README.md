# vitetask-repro05

Minimal repro for a Windows-specific `vite-task` cached execution issue.

The repro uses a local package binary, `marker-cli`, instead of a real framework
CLI. This keeps the package shim behavior while making the output easy to
inspect:

- `marker-cli <label>` prints `MARKER_STDOUT:<label>` to stdout.
- It also writes `.markers/<label>.json`.

That separates two failure modes:

- marker file exists, but `MARKER_STDOUT:<label>` is missing from the `vp run`
  step log: the process ran, but stdout was lost.
- marker file is missing: the CLI did not run.

## Manual Steps

```powershell
vp install

Remove-Item .markers -Recurse -Force -ErrorAction SilentlyContinue
vp cache clean
vp run shim:uncached
Get-Content .markers/shim-uncached.json

Remove-Item .markers -Recurse -Force -ErrorAction SilentlyContinue
vp cache clean
vp run node:cached
Get-Content .markers/node-cached.json

Remove-Item .markers -Recurse -Force -ErrorAction SilentlyContinue
vp cache clean
vp run shim:cached
Get-Content .markers/shim-cached.json
```

The important comparison is the `vp run shim:cached` step log versus
`.markers/shim-cached.json`.

On affected Windows runs, one of these failures is visible:

- `.markers/shim-cached.json` exists, but the `vp run shim:cached` log does not
  include `MARKER_STDOUT:shim-cached`: the CLI ran, but stdout was lost.
- `.markers/shim-cached.json` is missing: the Node CLI behind the package shim
  did not run.

The GitHub Actions workflow runs these commands directly on Linux and Windows.
`pnpm check` is kept as a convenience wrapper for local use, but CI does not use
it.
