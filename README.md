# CarBravo Frontend

A clean, feature-first React + TypeScript frontend foundation for CarBravo.

> This repository is an architecture skeleton only. It intentionally contains no existing CarBravo screens, business workflows, Hono mock API, backend implementation, or copied application code.

## Technology baseline

- React 19 + TypeScript
- Vite
- Material UI (MUI)
- React Router
- Axios
- TanStack Query
- React Hook Form + Zod
- Vitest + Testing Library
- Playwright
- Biome

See [docs/windows-pnpm-setup.md](docs/windows-pnpm-setup.md) if pnpm does not launch on Windows.
See [docs/dependency-baseline.md](docs/dependency-baseline.md) for the pinned stable dependency snapshot.
See [docs/architecture.md](docs/architecture.md) for the reasoning, boundaries, and implementation guidance.
See [docs/file-and-folder-conventions.md](docs/file-and-folder-conventions.md) for naming, folder creation, imports, and selective `index.ts` barrel exports.

## Requirements

- Node.js 26 LTS (latest 26.x security patch recommended)
- pnpm 12.21.0 (pinned in package.json)

## Getting started

```bash
npm install --global pnpm@12.21.0
pnpm install
cp .env.example .env.local
pnpm dev
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

The app starts with a deliberately minimal foundation screen. It is not a product screen.

## Commands

```bash
pnpm dev             # Start Vite
pnpm build           # Type-check and create production build
pnpm preview         # Preview production build
pnpm typecheck       # TypeScript checks
pnpm lint            # Biome lint
pnpm format          # Format supported source files
pnpm format:check    # Verify formatting
pnpm test             # Run Vitest
pnpm test:watch       # Run Vitest in watch mode
pnpm test:coverage    # Run tests with coverage
pnpm verify           # Run all local quality gates
pnpm test:e2e         # Run Playwright tests
```

## Project structure

```text
.
├── docs/
│   └── architecture.md
├── e2e/
├── public/
├── src/
│   ├── app/
│   ├── assets/
│   ├── components/
│   ├── config/
│   ├── constants/
│   ├── features/
│   ├── hooks/
│   ├── infra/
│   ├── lib/
│   ├── providers/
│   ├── routes/
│   ├── test/
│   ├── theme/
│   ├── types/
│   └── utils/
├── AGENT.md
├── biome.json
├── package.json
├── playwright.config.ts
├── tsconfig.json
└── vite.config.ts
```

## Important implementation rules

1. Keep pages thin and move feature behavior into feature-owned hooks and services.
2. Keep API calls out of components.
3. Keep server state in TanStack Query; do not mirror it in a second global store.
4. Keep feature-specific types, schemas, constants, and components inside that feature.
5. Add dependencies only when a concrete requirement justifies them.
6. Preserve working code when this skeleton is adopted into an existing repository; do not replace or delete existing behavior as part of structural setup.
7. Add tests with the behavior, not as a later cleanup task.

## Environment variables

Only variables prefixed with `VITE_` are exposed to browser code. Never put credentials, private keys, or server secrets in frontend environment files.

See `.env.example` and `src/config/env.ts`.
