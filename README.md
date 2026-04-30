# enirman-ui

Shared design system and Vue component library for every eNirman app.

- **Stack:** Vue 3 · frappe-ui · Tailwind · CSS variables · Lucide icons
- **Brand:** Engineering Blueprint — navy 700 primary, blue 500 action, amber 400 accent
- **Type:** Manrope (UI / display) + JetBrains Mono (IDs, currency, tabular numerics)
- **Density:** 14 px ERP base; subtle 6–12 px radii; navy-tinted layered shadows
- **Themes:** Light + dark, driven entirely by CSS variables
- **Sidebar:** Dark navy in both themes — the navy lockup is part of the brand
- **Responsive:** Mobile-first, with hamburger drawer on phones

> **v2 — Enirman Design System.** Tokens, primitives, and `AppShell` were
> resurfaced against the official design system bundle. See
> [`apps/enirman_ui/docs/DESIGN_TOKENS.md`](docs/DESIGN_TOKENS.md) for the
> authoritative variable list.

## Docs

- [`docs/USAGE.md`](docs/USAGE.md) — how to install and integrate in a new app
- [`docs/DESIGN_TOKENS.md`](docs/DESIGN_TOKENS.md) — every color, radius, shadow, size
- [`docs/COMPONENTS.md`](docs/COMPONENTS.md) — rules, variants, sizes per component

## Components

| Area | Components |
|---|---|
| Actions | `Button` (Soft / Flat / Ghost / Outline / Subtle / Link / Destructive / Success), `Icon` button sizes |
| Data display | `Card` family, `StatCard` (with optional sparkline), `Badge` (pill / tag, dot + status), `Progress`, `EuiSparkline`, `EuiAvatarStack`, `Skeleton` |
| Forms | `Input`, `Label`, `Switch` |
| Overlays | `Dialog`, `Sheet`, `Popover`, `DropdownMenu`, `Tooltip`, `Sonner` |
| Tables | `Table` family, `EuiPhaseTable`, `EuiPhaseKanban` |
| Navigation | `Tabs`, `PageHeader`, `Command` palette |
| Domain (CDE / design ops) | `EuiStageBadge`, `EuiBlockBadge`, `EuiCdeStateBadge`, `EuiDesignItemCard`, `EuiVersionTimeline`, `EuiStatusFlow`, `EuiDwgViewer`, `EuiFileViewer`, `EuiHandoffCard`, `EuiReviewCard`, `EuiActivityFeed` |
| Layout | `AppShell` (dark sidebar, 52 px topbar), `SidebarItem`, `SidebarSection`, `EmptyState`, `PageContainer` |
| Composables | `useTheme`, `useBreakpoint`, `useCommandPalette` |
| Brand | `logo`, `logoLight`, `logoMark` (asset URLs) |

## Rebranding

Every visual decision routes through `src/theme.css`. The brand scales
(`--brand-navy-*`, `--brand-blue-*`, `--brand-amber-*`) live at the top
of `:root`; the semantic tokens (`--primary`, `--accent`, `--success-*`,
etc.) reference them. Swap the brand scales and the entire system shifts
without touching components.

To opt a single app surface into a light sidebar, override the
`--sidebar-*` tokens inside that surface's scope.

## Soft button materiality

`<Button variant="default">` ships the **Soft** material — vertical
gradient, navy-tinted layered shadow, white inner highlight, and a
1 px translate on `:active`. This is the recommended default per the
design system. To restore a flat-shadcn appearance, use `variant="ghost"`
or `variant="outline"`.

## Status

v2 — Enirman Design System tokens, primitives, and AppShell. Branch
`v2`; consumer apps (e.g. `enirman_connect`) bump after merge.
