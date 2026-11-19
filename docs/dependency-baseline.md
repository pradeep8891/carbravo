# Dependency and runtime baseline

**Snapshot date:** 19 November 2026

This skeleton uses exact stable dependency versions. The versions below incorporate the updates supplied from the project's `ncu -u` report. Exact pins are intentional; the lockfile must be generated and committed by the project owner after installation.

## Runtime

| Tool | Version / policy |
|---|---|
| Node.js | 26 LTS line |
| pnpm | 12.21.0 |
| TypeScript | 7.0.2 |

Node.js 26 is the Active LTS line as of this snapshot. `@types/node` is aligned to major 26. The Node release line and lifecycle can be checked in the official [Node.js release schedule](https://github.com/nodejs/Release).

## Runtime dependencies

| Package | Version |
|---|---:|
| `@emotion/react` | `11.14.0` |
| `@emotion/styled` | `11.14.1` |
| `@hookform/resolvers` | `7.0.7` |
| `@mui/icons-material` | `9.5.0` |
| `@mui/material` | `9.5.0` |
| `@tanstack/react-query` | `5.108.0` |
| `axios` | `1.21.1` |
| `react` | `19.3.1` |
| `react-dom` | `19.3.1` |
| `react-hook-form` | `7.92.0` |
| `react-router` | `8.5.2` |
| `zod` | `4.6.7` |

## Development dependencies

| Package | Version |
|---|---:|
| `@biomejs/biome` | `2.6.8` |
| `@playwright/test` | `1.65.1` |
| `@testing-library/jest-dom` | `8.0.0` |
| `@testing-library/react` | `16.3.3` |
| `@testing-library/user-event` | `14.6.13` |
| `@types/node` | `26.6.6` |
| `@types/react` | `19.3.0` |
| `@types/react-dom` | `19.3.0` |
| `@vitejs/plugin-react` | `6.3.0` |
| `@vitest/coverage-v8` | `5.1.1` |
| `jsdom` | `31.0.1` |
| `typescript` | `7.0.2` |
| `vite` | `8.3.8` |
| `vitest` | `5.1.1` |

## Installation and reproducibility policy

- Exact versions are committed in `package.json`.
- `pnpm-lock.yaml` must be generated with the pinned pnpm version and committed.
- CI must use `pnpm install --frozen-lockfile`.
- Do not use `*`, `latest`, or floating dependency ranges.
- Do not automatically accept major upgrades. Review release notes, peer dependencies, security advisories, and migration impact.
- Run typecheck, lint, unit tests, production build, and critical E2E tests after upgrades.
- This ZIP intentionally does not include `pnpm-lock.yaml`: dependency resolution and installation have not been run in the user's Windows environment. Generate it there using the pinned pnpm version.

## Important

A pinned package manifest is not proof that every package combination has been installed and tested. Treat this as the final proposed dependency baseline; the lockfile and quality checks are the final installation verification.
