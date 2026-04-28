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

```powershell
pnpm install

$vp = if ($IsWindows) { ".\node_modules\.bin\vp.CMD" } else { "./node_modules/.bin/vp" }

& $vp cache clean
$output = & $vp run shim:uncached 2>&1 | Out-String
Write-Output $output
if (-not $output.Contains("6.0.0")) { throw "uncached package shim failed" }

& $vp cache clean
$output = & $vp run node:cached 2>&1 | Out-String
Write-Output $output
if (-not $output.Contains("6.0.0")) { throw "cached direct Node CLI failed" }

& $vp cache clean
$output = & $vp run shim:cached 2>&1 | Out-String
Write-Output $output
if (-not $output.Contains("6.0.0")) { throw "cached package shim failed" }
```

The GitHub Actions workflow runs these steps directly on Linux and Windows.
`pnpm check` is kept as a convenience wrapper for local use, but CI does not
use it.
