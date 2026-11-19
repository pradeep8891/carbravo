# File and Folder Conventions

These conventions apply to the CarBravo React + TypeScript frontend. They favor discoverability and clear ownership over uniform folder shapes.

## 1. Folder creation

- Create a folder only when a real source file needs it.
- Do not commit empty directories or add `.gitkeep` placeholders.
- Do not pre-create every possible feature subfolder.
- Add a feature subfolder such as `api/`, `components/`, `hooks/`, `pages/`, `schemas/`, `types/`, or `utils/` only when that responsibility exists.
- Keep feature-specific code under `src/features/<feature>/`; promote code to shared folders only after there is a genuine cross-feature use case.
- Do not reorganize existing working files solely to make folders look symmetrical.

## 2. File naming

| File kind | Convention | Example |
|---|---|---|
| React component | PascalCase | `VehicleCard.tsx` |
| Page / route component | PascalCase + Page where useful | `VehicleDetailsPage.tsx` |
| Hook | `use-` prefix, kebab-case filename | `use-vehicle-details.ts` |
| API module | kebab-case + `.api.ts` | `vehicles.api.ts` |
| Query keys | kebab-case + `.keys.ts` | `vehicles.keys.ts` |
| Query hooks/options | kebab-case + `.queries.ts` | `vehicles.queries.ts` |
| Schema | kebab-case + `.schema.ts` | `vehicle.schema.ts` |
| Types | descriptive kebab-case filename | `vehicle.types.ts` |
| Constants | descriptive kebab-case filename | `vehicle.constants.ts` |
| Utility | descriptive kebab-case filename | `vehicle-formatters.ts` |
| Test | source filename + `.test.ts(x)` | `vehicle.schema.test.ts` |

Use named exports by default. Use default exports only when a framework or integration explicitly requires them.

## 3. When to add `index.ts`

An `index.ts` is an intentional public entry point (barrel), not a required file in every directory.

Add one only when:
- the folder exposes multiple related items that consumers should import as a stable public API; or
- a small, cohesive module benefits from one clear import path.

Good examples:
- `src/config/index.ts` exposes validated application configuration.
- `src/theme/index.ts` exposes the configured application theme.
- A feature root `src/features/vehicles/index.ts` may expose the feature's supported public components/types when there are actual external consumers.

Do not add an `index.ts`:
- to every folder by default;
- to a folder containing one internal implementation file with no public API need;
- just to shorten a relative import by one path segment;
- as a pass-through chain of barrels (folder A re-exports folder B which re-exports folder C).

## 4. Barrel export rules

- Export only symbols intentionally supported for use outside that folder or feature.
- Prefer explicit named exports; avoid `export *` when it makes ownership or collisions unclear.
- Keep internal files importing other internal files directly.
- Do not import a feature through its own root `index.ts` from inside that same feature; use direct relative imports to avoid self-referential cycles.
- Avoid cross-feature barrel imports that create dependency cycles. Shared code should not import features.
- Do not create barrels solely for tests. Tests may import the module under test directly.
- Keep route registration explicit; do not hide route definitions behind broad barrel exports.

Example:

```ts
// src/features/vehicles/components/index.ts
export { VehicleCard } from './VehicleCard'
export { VehicleStatus } from './VehicleStatus'
```

Consumer:

```ts
import { VehicleCard, VehicleStatus } from '@/features/vehicles/components'
```

Internal component-to-component import:

```ts
import { VehicleStatus } from './VehicleStatus'
```

## 5. Import conventions

- Use the configured `@/` alias for imports from the `src` root.
- Use relative imports for nearby implementation details within the same cohesive folder.
- Avoid long chains of `../../..` when the root alias makes ownership clearer.
- Do not create a barrel just to work around an unclear dependency boundary.
- Keep imports acyclic and follow the dependency direction in [architecture.md](./architecture.md).

## 6. Tests and colocated files

- Keep unit/component tests next to the source they verify using `*.test.ts` or `*.test.tsx`.
- Shared test setup and reusable test helpers belong in `src/test/`.
- Do not create a `tests/` folder inside every feature unless the feature's test volume or integration setup justifies it.
- Keep fixtures close to the tests that own them; share fixtures only when multiple test suites genuinely use them.

## 7. Review checklist

Before adding a folder or barrel:
1. Does a real source file need this folder now?
2. Is this code feature-owned or genuinely shared?
3. Does the folder have a stable public API that another module consumes?
4. Will the barrel introduce a cycle or obscure an internal dependency?
5. Can a direct import remain clearer?

If the benefit is only visual symmetry or fewer characters in an import, do not add the folder or barrel.
