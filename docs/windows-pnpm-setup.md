# Windows: install and repair pnpm

The project pins pnpm `12.21.0` in `package.json`. The package manager must match that version.

## Fresh setup

Open a new Command Prompt or PowerShell window:

```powershell
node --version
npm --version
npm install --global pnpm@12.21.0
pnpm --version
```

Expected pnpm output:

```text
12.21.0
```

Then, from the project root:

```powershell
pnpm install
```

## If the pnpm command is broken

If Windows reports that a path under `%LOCALAPPDATA%\pnpm\.tools\pnpm\...` is not recognized, the pnpm shim or managed installation may be stale.

1. Close all terminals and open a fresh terminal.
2. Inspect command resolution:

   ```cmd
   where node
   where npm
   where pnpm
   ```

3. If `pnpm` resolves to an obsolete Corepack or standalone shim, inspect the listed path before removing or changing anything.
4. Install the pinned pnpm release through npm:

   ```cmd
   npm install --global pnpm@12.21.0
   ```

5. Close and reopen the terminal, then verify:

   ```cmd
   pnpm --version
   ```

Do not delete the project `pnpm-lock.yaml`, `node_modules`, or package files as a first troubleshooting step. Fix the command launcher first.

## Reproducible installation

After `pnpm --version` reports `12.21.0`:

```cmd
pnpm install
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Commit `pnpm-lock.yaml` after the installation and checks complete successfully. CI should use:

```cmd
pnpm install --frozen-lockfile
```
