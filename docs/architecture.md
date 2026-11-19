# CarBravo Frontend Architecture

## 1. Purpose

This document records the proposed frontend architecture, the reasons for choosing it, the responsibilities of each layer, and the conventions contributors must follow.

The goal is a maintainable React application that can integrate with a separately developed Java API. The frontend must remain independent of the backend implementation and must be straightforward for developers new to the codebase.

This repository is a **skeleton**, not a completed product. It contains no CarBravo business screens, production API integration, Hono mock server, or business workflows.

## 2. Runtime baseline

Use Node.js 26 LTS and pnpm 12.21.0 for local development and CI. The exact direct dependency pins and update policy are documented in [dependency-baseline.md](dependency-baseline.md). Keep Node type definitions aligned with the selected Node major version.

## 3. Architectural goals

- Clear separation between presentation, feature behavior, and infrastructure.
- Feature-level ownership and cohesion.
- Reusable UI without creating a premature component framework.
- Strong compile-time and runtime validation at system boundaries.
- Predictable API caching and request lifecycle.
- Testability at utility, component, integration, and browser levels.
- Backend independence through explicit API contracts.
- Low operational and maintenance complexity.

## 4. Architectural style: feature-first with shared infrastructure

The application uses a feature-first structure. Business capabilities live in `src/features`. Cross-cutting infrastructure and genuinely reusable UI live outside features.

```text
src/
├── app/             # Root application composition
├── assets/          # Imported images, fonts, and static assets
├── components/      # Truly shared UI components
├── config/          # Validated runtime configuration
├── constants/       # Application-wide constants
├── features/        # Business capabilities
├── hooks/           # Truly shared hooks
├── infra/           # HTTP, API, auth, and browser integration
├── lib/             # Third-party library setup
├── providers/       # React providers
├── routes/          # Route definitions and guards
├── test/            # Shared test setup and helpers
├── theme/           # MUI theme and design tokens
├── types/           # Cross-feature types
└── utils/           # Generic pure utilities
```

### Why feature-first?

A feature's UI, API functions, hooks, schemas, types, and tests are usually changed together. Keeping them together makes ownership clear and reduces the need to navigate unrelated global folders.

A global `components/` or `hooks/` folder should contain only code that is genuinely shared. Feature-specific code must not be promoted to shared prematurely.

### Why not a deeply layered enterprise architecture?

The frontend does not need a large set of service, repository, adapter, and domain layers for every operation. That would add indirection without demonstrated value. Introduce a new layer only when it protects a real boundary or removes meaningful duplication.

## 5. Technology choices and rationale

| Technology | Responsibility | Why it is selected |
|---|---|---|
| React | UI framework | Component model and ecosystem |
| TypeScript | Static typing | Safer refactoring and explicit contracts |
| Vite | Build tooling | Fast local development and standard build pipeline |
| MUI | UI foundation | Accessible, consistent component primitives and theming |
| React Router | Routing | Explicit route composition and nested layouts |
| Axios | HTTP transport | Centralized base URL, timeout, and interceptors |
| TanStack Query | Server state | Caching, request deduplication, invalidation, and lifecycle |
| React Hook Form | Form state | Efficient form state management |
| Zod | Runtime validation | Typed schemas and validation at external boundaries |
| Vitest | Unit test runner | Vite-aligned test environment |
| Testing Library | Component tests | Tests user-visible behavior |
| Playwright | Browser E2E | Real browser workflow coverage |
| Biome | Lint and format | One focused tool for common code-quality tasks |

These are the baseline choices, not a reason to install optional packages indiscriminately. Any additional dependency requires a concrete use case, maintenance assessment, and approval where appropriate.

## 6. Dependency direction

The intended dependency direction is:

```text
Routes
  └── Feature pages
       ├── Feature components
       └── Feature hooks
            ├── Feature API modules
            │    └── Shared API client (infra)
            └── Shared UI / utilities

App
  ├── Providers
  ├── Router
  └── Theme
```

Rules:

- Shared infrastructure must not import feature modules.
- Shared components must not contain feature business rules.
- A feature may use shared infrastructure and shared UI.
- Avoid feature-to-feature imports. If two features need the same concept, first determine whether it is truly a shared capability.
- Keep dependency direction acyclic.

## 7. Feature module convention

A feature can use this structure when the feature actually needs those responsibilities:

```text
features/
└── example/
    ├── api/
    │   ├── example.api.ts
    │   ├── example.keys.ts
    │   └── example.queries.ts
    ├── components/
    ├── hooks/
    ├── pages/
    ├── schemas/
    ├── types/
    └── utils/
```

Do not create empty layers for convention's sake. A small feature may start with only the files it needs, then grow as complexity appears. Add a feature-root `index.ts` only when the feature has a deliberate public API for consumers outside the feature. Do not create one automatically.

### Pages and components

- Pages are route-level composition units.
- Components render focused pieces of UI.
- Components receive typed props and emit user intent through callbacks.
- Components should not know API URLs or transport details.
- Complex behavior belongs in focused hooks or feature modules, not giant page components.

### API modules and hooks

- `*.api.ts` contains typed endpoint functions and transport mapping.
- `*.keys.ts` defines stable query keys for that feature.
- `*.queries.ts` contains TanStack Query options/hooks.
- Mutations invalidate only the relevant query keys.
- Do not make network requests during render.

## 8. API and backend independence

The Java API is maintained separately. The frontend integrates through an agreed OpenAPI contract.

```text
Feature UI
   ↓
Feature query/mutation
   ↓
Feature API function
   ↓
Central Axios client
   ↓
Configured API base URL
   ↓
Java API
```

The frontend should not depend on backend implementation details such as database schema, ORM models, or internal service classes.

### Contract rules

- OpenAPI is the source of truth for endpoint paths, payloads, response shapes, and error contracts.
- Frontend types must match the agreed contract.
- Validate important untrusted payloads at runtime where appropriate.
- Keep UI view models separate from transport DTOs when the shapes or semantics differ.
- Centralize transport error normalization.
- Never assume a successful HTTP status means the business operation succeeded; follow the API contract.

A mock backend may be used during development, but it must implement the same contract. Mock-specific fields and behavior must not leak into feature UI.

## 9. State management

Use the smallest state mechanism that fits the state.

| State | Preferred owner |
|---|---|
| Remote API data | TanStack Query |
| Form values and errors | React Hook Form |
| Temporary component state | React `useState` / `useReducer` |
| URL-addressable filters | React Router search params |
| Cross-tree UI state | React Context when justified |
| Persistent user preferences | A small storage abstraction |

Do not mirror query data in a global store. Do not add Redux or Zustand unless a demonstrated application requirement cannot be handled cleanly by the existing tools.

## 10. Configuration and environment

- Validate environment variables once at application startup.
- Keep environment access inside `src/config`.
- Use `VITE_` only for values safe to expose in the browser.
- Never store secrets, private credentials, or server API keys in frontend configuration.
- Keep development, test, staging, and production behavior explicit.
- Fail early with a clear message when required configuration is absent.

## 11. UI system and styling

MUI is the single component foundation.

- Configure brand colors, typography, spacing, breakpoints, and component defaults in `src/theme`.
- Prefer theme tokens over arbitrary one-off values.
- Use MUI components directly when they already meet the need.
- Add shared wrappers only when they enforce a meaningful design or behavior standard.
- Keep feature-specific composition inside the feature.
- Follow accessible semantics, keyboard interaction, focus visibility, and responsive layout practices.

## 12. Constants, types, schemas, and utilities

- Application-wide constants belong in `src/constants`.
- Feature-only constants belong in that feature.
- Cross-feature types belong in `src/types` only when they are genuinely shared.
- Feature API and UI types belong in the feature.
- Zod schemas belong near the boundary or feature that owns the validation.
- Generic pure functions belong in `src/utils`; feature-specific transformations stay in the feature.
- Avoid catch-all files such as `common.ts`, `helpers.ts`, or `misc.ts`.

## 13. Testing strategy

| Level | Tool | Scope |
|---|---|---|
| Unit | Vitest | Pure functions, schemas, query helpers |
| Component | Vitest + Testing Library | Rendering, accessibility, interactions |
| Integration | Vitest + Testing Library / MSW when needed | Feature behavior across boundaries |
| End-to-end | Playwright | Critical user journeys in a browser |

Test observable behavior rather than implementation details. Add tests with the feature change. Avoid brittle snapshots as the primary verification strategy.

## 14. Code quality and CI

The expected quality gates are:

1. Biome lint.
2. Biome format check.
3. TypeScript typecheck.
4. Unit and component tests.
5. Production build.
6. Playwright tests for critical workflows.
7. SonarCloud quality gate where configured by the project pipeline.

A change is not complete merely because it compiles. Report which checks were actually run and any checks that remain outstanding.

## 15. Security and privacy

- No secrets in browser bundles or `VITE_` variables.
- Do not log access tokens, personal data, or sensitive request bodies.
- Treat URL parameters, browser storage, and API responses as untrusted.
- Avoid unsafe HTML rendering. Sanitize content when rendering user-controlled rich text.
- Apply authorization on the backend; frontend route guards are a UX control, not a security boundary.
- Use secure token/session handling agreed with the backend and security owners.
- Do not persist sensitive data in local storage without an approved security design.

## 16. Performance principles

- Use TanStack Query caching and request deduplication appropriately.
- Avoid duplicate requests and broad invalidation.
- Keep query keys stable.
- Paginate or virtualize genuinely large datasets.
- Lazy-load route-level bundles where beneficial.
- Avoid premature memoization; profile before optimizing.
- Keep bundle dependencies deliberate and inspect bundle growth.

## 17. Naming conventions

| Item | Convention | Example |
|---|---|---|
| React component | PascalCase | `ProgramTable.tsx` |
| Hook | camelCase with `use` | `usePrograms.ts` |
| API module | kebab-case | `programs.api.ts` |
| Query keys | feature-owned constant | `programs.keys.ts` |
| Types | descriptive names | `ProgramSummary` |
| Zod schema | descriptive schema suffix | `program.schema.ts` |
| Test | source name + test | `program.utils.test.ts` |
| Constants | descriptive suffix | `program.constants.ts` |

Prefer named exports and explicit imports. Avoid large barrel files that hide dependencies or create cycles.

## 18. File, folder, and export conventions

Follow [file-and-folder-conventions.md](./file-and-folder-conventions.md) for detailed naming, folder creation, import, and barrel-export rules.

The short version: create folders when real files need them; never use `.gitkeep` to pre-create planned structure; and add `index.ts` only for intentional public entry points. Prefer direct imports for internal implementation details. Barrels must not create circular dependencies or hide ownership.

## 19. Adoption strategy

When applying this architecture to an existing application:

1. Audit the current repository and identify working behavior.
2. Compare current dependencies and configuration with this baseline.
3. Agree on the API contract and feature boundaries.
4. Add missing foundation incrementally.
5. Migrate one feature at a time.
6. Run tests and quality gates after each meaningful change.
7. Remove old patterns only after proving they are unused and safe to remove.

Do not perform a wholesale rewrite solely to achieve folder symmetry.

## 20. Architecture decision summary

The chosen approach deliberately balances consistency with low complexity:

- Feature-first organization gives each business capability clear ownership.
- Shared infrastructure centralizes cross-cutting concerns without coupling features.
- TanStack Query handles server state without a second global state system.
- MUI provides a consistent accessible UI foundation.
- OpenAPI-aligned API modules keep the frontend independent from Java internals.
- Vitest, Testing Library, Playwright, and Biome establish quality from the beginning.

The architecture should evolve in response to real product needs. Any material change should be recorded here with its context, decision, and consequences.
