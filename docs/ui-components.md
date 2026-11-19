# Shared MUI Components

CarBravo uses Material UI as its component library. The shared components in
`src/components/ui` provide only CarBravo-specific semantics or repeated
application behavior; they do not replace MUI.

## Components

| Component | Use |
|---|---|
| `Button` | CarBravo button variants and a consistent loading state |
| `StatusChip` | Compact semantic status labels |
| `EmptyState` | Consistent empty collection/content feedback |
| `ErrorState` | Consistent error feedback with an optional retry action |
| `PageLoader` | Accessible inline or full-page loading feedback |

Import from the UI entry point:

```tsx
import {
  Button,
  EmptyState,
  ErrorState,
  PageLoader,
  StatusChip,
} from "@/components/ui";
```

## Examples

```tsx
<Button variant="primary" onClick={save} loading={saving}>
  Save changes
</Button>

<StatusChip label="Active" tone="success" />

<EmptyState
  title="No vehicles found"
  description="Try changing your search filters."
  action={<Button variant="outline" onClick={clearFilters}>Clear filters</Button>}
/>

<ErrorState onRetry={refetch} />

<PageLoader label="Loading vehicles" />
```

## Use MUI directly when no shared behavior is needed

The theme already styles common MUI components using CarBravo's design tokens.
Use MUI directly for components such as `TextField`, `Select`, `Card`,
`Avatar`, `Checkbox`, `Radio`, `Switch`, `Dialog`, `Tabs`, and
`Tooltip`.

Do not add wrappers that only rename or forward MUI props. Add a shared
component only when it provides a stable CarBravo API, shared behavior, or
meaningful accessibility/consistency.

## Design rules

- Use the existing MUI theme; do not hardcode brand colors in feature screens.
- Preserve light and dark mode behavior.
- Prefer semantic variants over arbitrary color props.
- Keep components domain-neutral. Vehicle, program, and dealer-specific
  presentation belongs in the owning feature.
- Keep each component independently testable.
- Do not add Tailwind, class-merging utilities, or another component library.
