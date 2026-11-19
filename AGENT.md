# Agent Instructions — CarBravo Frontend

These instructions apply to AI coding agents and human contributors working in this frontend.

## Scope

- Work only in the CarBravo frontend.
- This repository is a frontend foundation; the Java backend is maintained separately.
- Do not introduce backend implementation, database access, server secrets, or backend-owned business rules here.

## Non-negotiable engineering principles

1. **Keep it simple.** Do not add abstractions, dependencies, layers, or state libraries without a concrete need.
2. **Preserve existing behavior.** Never delete, rewrite, or reorganize working code just to make it match a preferred structure.
3. **Small components.** Components should have one clear responsibility and remain easy to test.
4. **Thin pages.** Route pages compose feature components and hooks; they should not become business-logic containers.
5. **Feature ownership.** Feature-specific API functions, hooks, schemas, types, constants, and components belong inside the feature.
6. **Typed boundaries.** Avoid `any`, unsafe assertions, and unvalidated external data.
7. **No component-level HTTP calls.** Use feature API modules and TanStack Query hooks.
8. **No duplicated state.** Do not copy server data into local/global state without a documented reason.
9. **No hardcoded environment URLs.** Read validated configuration from `src/config`.
10. **No secrets in frontend code.** Browser-exposed environment variables are public.

## Architecture conventions

- Use feature-first organization under `src/features/<feature-name>/`.
- Use `PascalCase` for React components and component files.
- Use `camelCase` for functions, variables, and hooks (`useSomething`).
- Use `kebab-case` for non-component utility/config files where practical.
- Use `*.test.ts` / `*.test.tsx` for unit and component tests.
- Prefer named exports; use default exports only where framework/tool conventions require them.
- Keep shared code genuinely generic. If code is used by one feature, keep it in that feature.
- Create folders only when real source files need them; do not add `.gitkeep` placeholders or empty planned layers.
- Add `index.ts` only when a folder has a deliberate public API; do not add one to every folder.
- Keep internal imports direct, use explicit named exports in barrels, and avoid self-imports/cycles.
- Follow [file and folder conventions](docs/file-and-folder-conventions.md) for naming, imports, barrels, and folder creation.

## API rules

- All HTTP traffic goes through the centralized Axios client in `src/infra/api/`.
- Feature endpoints live in `src/features/<feature>/api/`.
- Query keys are defined and owned by the feature.
- API request/response types must follow the approved OpenAPI contract.
- Treat mock and production API responses as untrusted external input.
- Normalize transport errors in the infrastructure layer; map feature-specific meaning in the feature layer.
- Do not add automatic retries for mutations.
- Do not log tokens, personal data, or full sensitive request/response payloads.

## UI rules

- Use MUI as the single UI component foundation.
- Use the shared theme and design tokens; avoid arbitrary one-off styling values.
- Do not create wrappers around every MUI component. Create shared components only when they establish consistent behavior or product design.
- Include loading, empty, error, and success states where relevant.
- Ensure keyboard accessibility, semantic markup, and responsive behavior.

## State rules

- Remote/server state: TanStack Query.
- Form state: React Hook Form.
- Validation: Zod.
- Local ephemeral UI state: React state.
- Share state through context only when multiple distant consumers genuinely need it.
- Put shareable filters, pagination, and sorting in URL search parameters where appropriate.
- Do not add Redux or Zustand by default.

## Testing and quality gates

Before completing a change:

1. Run `pnpm typecheck`.
2. Run relevant tests with `pnpm test`.
3. Run `pnpm lint`.
4. Run `pnpm build`.
5. Add or update tests for changed behavior.
6. For user-critical flows, add or update Playwright coverage.

Do not claim checks passed unless they were actually run. Report failures and known limitations clearly.

## Change discipline

- Make the smallest change that fully satisfies the request.
- Do not reformat unrelated files.
- Do not upgrade dependencies opportunistically.
- Do not change public API contracts without documenting the reason and impact.
- Ask before destructive changes, broad migrations, or introducing a new architectural dependency.
- Update `docs/architecture.md` when an architectural decision changes.
