# @enirman/ui

Shared design system and Vue component library for every eNirman app.

- **Stack:** Vue 3 · frappe-ui · Tailwind · CSS variables · Lucide icons
- **Style:** Notion-minimal base + Stripe-dashboard density, with vibrant neutral accents
- **Themes:** Light + dark, driven entirely by CSS variables
- **Responsive:** Mobile-first, with hamburger drawer on phones

## Install

```bash
yarn add @enirman/ui
# or
npm install @enirman/ui
```

See [`docs/USAGE.md`](docs/USAGE.md) for full integration steps.

## Docs

- [`docs/USAGE.md`](docs/USAGE.md) — how to install and integrate in a new app
- [`docs/DESIGN_TOKENS.md`](docs/DESIGN_TOKENS.md) — every color, radius, shadow, size
- [`docs/COMPONENTS.md`](docs/COMPONENTS.md) — rules, variants, sizes per component

## Components

| Area | Components |
|---|---|
| Actions | `EuiButton`, `EuiIconButton` |
| Data display | `EuiCard`, `EuiSectionCard`, `EuiMetricCard`, `EuiListRow`, `EuiBadge`, `EuiStatusDot`, `EuiProgressBar`, `EuiSkeleton` |
| Forms | `EuiInput`, `EuiSearchInput` |
| Overlays | `EuiDialog`, `EuiDropdown` |
| Navigation | `EuiTabs`, `EuiPageHeader` |
| Layout | `EuiAppShell`, `EuiSidebarSection`, `EuiSidebarItem`, `EuiEmptyState` |
| Composables | `useTheme`, `useBreakpoint` |

## Rebranding

Every visual decision routes through `src/theme.css`. To change the
primary color across every consumer app, edit the six `--brand-*` values
in `:root` and `[data-theme="dark"]` — nothing else needs to change.

## Releasing

See [`RELEASING.md`](RELEASING.md) for the publish ritual.

## License

MIT — see [`LICENSE`](LICENSE).
