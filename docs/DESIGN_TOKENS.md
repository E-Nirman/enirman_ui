# Design Tokens

Every visual decision in enirman-ui resolves to a CSS variable. The
variables are defined in `src/theme.css` and re-exposed to Tailwind
utility classes by `tailwind-preset.js`. Tokens live in two scopes:
**brand tokens** (raw colors, change to rebrand) and **semantic tokens**
(named by purpose — most components read these).

---

## Brand axis (5.3.0)

Two orthogonal axes, two disjoint override sets, both keyed on `<html>`:

| Axis | Attribute | Overrides |
|---|---|---|
| Theme | `data-theme="light" \| "dark"` | surfaces, text, borders, status tones |
| Brand | `data-brand="aec" \| "estate"` | brand surface, action, link, sidebar, focus, shadow tint, clay mark |

- `src/brands/aec.css` — the default brand. Its light block is
  `:root, [data-brand="aec"]` and its dark block is
  `[data-theme="dark"], [data-brand="aec"][data-theme="dark"]`, so a
  document with no `data-brand` renders identically to one with
  `data-brand="aec"`.
- `src/brands/estate.css` — the Estate brand. Two raw ramps
  (`--brand-clay-50…900`, logo mark only — never a surface;
  `--brand-indigo-50…900`, the A1 indigo-slate action colour) and a partial
  override of the brand-axis tokens: brand surface (`--bg-brand`,
  `--border-brand`, `--bg-inverse`, `--fg-on-brand`), action
  (`--action-primary*`, `--primary`, `--accent*`, `--bg-accent-subtle`),
  link (`--fg-link*`), focus (`--border-focus`, `--ring`, `--shadow-focus`),
  sidebar (`--sidebar-*`, light neutral) and the shadow tint (`--shadow-*`
  and `--button-shadow-soft*`, clay-900 `rgba(29, 13, 8, a)`).
- Select at runtime with `useTheme().setBrand('aec' | 'estate')`; see
  `docs/USAGE.md` §5.

The dark theme block deliberately does not override brand/identity tokens
and a brand block must not override theme-only tokens. The one sanctioned
exception is Estate's dark block, which sets a neutral-slate structural
ladder because Estate has no dark brand-surface hue to build one from.
The complete list of theme-axis tokens any brand file overrides is
`--bg-canvas`, `--bg-surface`, `--muted`, `--secondary`, `--border`,
`--input`, `--border-subtle`, `--border-strong` — nothing else.
(`--background`, `--card`, `--popover`, `--bg-sunken`, `--border-default`,
`--action-secondary*` follow through the `var()` refs the AEC dark block
already declares.)

### Cascade rule — read before touching a brand file

`[data-brand="estate"]` and `[data-theme="dark"]` have the **same
specificity** (0,1,0), and `brands/estate.css` is imported after
`brands/aec.css`. So for any token that both the Estate **light** block
and the AEC **dark** block declare, the Estate light value wins in dark
mode unless the Estate **dark** block re-declares it. Every token the
Estate light block sets that the AEC dark block also tunes therefore
appears again in the Estate dark block, even when the value is simply the
AEC dark value repeated (`--sidebar-foreground: var(--fg-on-inverse)` and
friends). The two axes are disjoint in *intent*; they are not disjoint in
the cascade.

### Estate palette

| Token | Light | Dark |
|---|---|---|
| `--brand-clay-500` (the "E" mark, never a surface) | `#793722` | invariant |
| `--brand-indigo-500` | `#585E95` | — |
| `--action-primary` | `234 26% 46.5%` (#585E95, 6.09:1 white-on) | `233 30% 54%` (#676FAD, 4.71:1 white-on — a **one-off literal**, not on the ramp; indigo-400 is 3.63:1 and fails AA) |
| `--action-primary-hover` / `-active` | indigo-600 / -700 | indigo-300 / -200 |
| `--accent` / `--accent-foreground` | indigo-50 / indigo-700 | indigo-800 / indigo-100 |
| `--fg-link` / `--fg-link-hover` | indigo-500 / -600 | indigo-300 / -200 |
| `--border-focus`, `--ring` | tracks `--action-primary` | tracks `--action-primary` |
| `--sidebar` | gray-50 | `220 19% 7%` (#0F1216) |
| `--sidebar-foreground` / `-muted` | gray-900 / gray-500 | `--fg-on-inverse` / `--fg-on-inverse-muted` |
| `--sidebar-accent` (painted at 6% alpha — an ink) | gray-900 | white (`--border-on-inverse`) |
| `--sidebar-primary` / `-primary-foreground` (active row) | indigo-50 / indigo-700 | `218 15% 18%` / gray-50 |
| `--bg-canvas` / `--bg-surface` / `--muted` / `--border` | inherited (no override) | `220 15% 9%` / `220 15% 13%` / `218 15% 18%` / `218 15% 21%` |
| `--border-subtle` / `--border-strong` / `--secondary` / `--input` | inherited | `218 15% 20%` / `218 15% 31%` / `= --muted` / `= --border` |
| shadow tint | `rgba(29, 13, 8, a)` | invariant |

**Known limitation.** `SidebarItem` uses `--sidebar-primary` for both the
active-row fill and the `focus-visible` ring. Estate's active fill is a
deliberate low-contrast tint (indigo-50 on gray-50; #262B34 on #0F1216) —
the row's text carries the state — so the same token makes the focus ring
near-invisible. Estate components should draw their focus ring from
`--ring`. Not a 5.3.0 concern.

**Open finding (enirman_ui#1).** AEC's own dark `--action-primary`
(`211 87% 56%`) is 3.43:1 white-on and fails AA; so do dark
`--sidebar-primary` (same value) and `--fg-link` on the dark canvas
(3.60:1). A value change under an existing name is a major, so it waits
for the 6.0.0 window.

### `pooled` tone (5.3.0)

Shared / commons tone, same shape as `success` / `warning` / `danger` /
`info` plus `-border` and `-card`. Identical in every brand; AEC carries it
unused so the token is never undefined.

| Token | Light | Dark |
|---|---|---|
| `--pooled` | `177 71% 30%` (#16827D) | invariant |
| `--pooled-hover` | `177 67% 36%` (#1E9A94) | invariant |
| `--pooled-foreground` | `0 0% 100%` | invariant |
| `--pooled-muted` | `175 68% 90%` (#D5F7F4) | `177 59% 15%` (#0F3B39) |
| `--pooled-ink` | `178 100% 14%` (#004946) | `176 44% 69%` (#8ED3CE) |
| `--pooled-border` | `176 44% 69%` (#8ED3CE) | `178 55% 26%` (#1E6663) |
| `--pooled-card` | `175 62% 96%` (#EEFBFA) | `174 31% 12%` (#152826) |

Tailwind: `pooled`, `pooled-foreground`, `pooled-muted`, `pooled-ink`,
`pooled-border`, `pooled-card` (e.g. `bg-pooled-card text-pooled-ink
border-pooled-border`).

### Density opt-ins

| Class | Effect |
|---|---|
| `.ds-marketing` | `font-size: 16px` |
| `.ds-field` (5.3.0) | `font-size: 16px`; `button`, `[role="button"]`, `input`, `select` inside get `min-height: 44px` — touch-first surfaces used on site |

---

## Color

### Brand scale (change to rebrand)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--brand-50`  | `#eff6ff` | `#172554` | Subtlest tint — backgrounds of info callouts, active sidebar items |
| `--brand-100` | `#dbeafe` | `#1e3a8a` | Hover states on subtle backgrounds |
| `--brand-300` | `#93c5fd` | `#60a5fa` | Dark-mode accent text |
| `--brand-500` | `#3b82f6` | `#60a5fa` | Primary action color (buttons, links, focus rings) |
| `--brand-600` | `#2563eb` | `#3b82f6` | Hover state for `--brand-500` |
| `--brand-700` | `#1d4ed8` | `#93c5fd` | Ink on subtle backgrounds (light mode) |

### Semantic colors

Each accent tone has three variants: base (solid fill), `-subtle`
(tinted background), and `-ink` (accessible text over subtle).

| Tone | Variables | Use |
|---|---|---|
| `primary` | `--color-primary`, `--color-primary-hover`, `--color-primary-subtle`, `--color-primary-ink` | Main brand CTA |
| `success` | `--color-success`, `--color-success-subtle`, `--color-success-ink` | Completed, approved, positive states |
| `warning` | `--color-warning`, `--color-warning-subtle`, `--color-warning-ink` | Caution, pending, attention needed |
| `danger`  | `--color-danger`,  `--color-danger-subtle`,  `--color-danger-ink`  | Errors, destructive, overdue |
| `info`    | `--color-info`,    `--color-info-subtle`,    `--color-info-ink`    | Neutral informational callouts |
| `accent`  | `--color-accent`,  `--color-accent-subtle`,  `--color-accent-ink`  | Premium/Plus-tier indicators |

### Surfaces (inherited from frappe-ui, overridden in dark mode)

| Token | Purpose |
|---|---|
| `--surface-white` | Page background / cards (light) |
| `--surface-gray-1` | Subtle fill — dropdown headers, disabled states |
| `--surface-gray-2` | Separators, dividers, input backgrounds |
| `--surface-gray-3` | Borders, skeleton shimmer |
| `--surface-menu-bar` | Sidebar background |
| `--surface-cards` | Elevated cards (dark mode only) |
| `--surface-modal` | Dialog background (dark mode only) |

### Ink (text — frappe-ui scale)

`--ink-gray-4` (muted) → `--ink-gray-5` (secondary) → `--ink-gray-7` (body) → `--ink-gray-9` (strongest)

Never use raw hex or Tailwind's `gray-500` for text. Always use ink tokens
so dark mode inverts correctly.

---

## Radius

| Token | Px | Use |
|---|---|---|
| `--radius-xs`  | 4  | Small chips, keyboard shortcut tags |
| `--radius-sm`  | 6  | Default buttons, inputs, focus rings |
| `--radius-md`  | 8  | Dropdown items, sidebar items, small cards |
| `--radius-lg`  | 10 | Dropdown menus, popovers |
| `--radius-xl`  | 12 | Cards, dialogs |
| `--radius-2xl` | 16 | Mobile bottom sheets, feature tiles |
| `--radius-full`| 9999 | Pills, avatars, status dots |

---

## Elevation (shadow)

| Token | Use |
|---|---|
| `--shadow-xs` | Buttons, inputs (barely-there lift) |
| `--shadow-sm` | Raised cards, sticky headers |
| `--shadow-md` | Hover on interactive cards |
| `--shadow-lg` | Popovers, floating toolbars |
| `--shadow-xl` | Dialogs, drawers |
| `--shadow-pop` | Dropdown menus (larger blur, high contrast) |

Dark mode bumps all shadows — softer surfaces need stronger shadows to
read as elevated.

---

## Typography

Tailwind font sizes are bumped ~1px vs defaults for density-at-readability:

| Class | Size | Line height |
|---|---|---|
| `text-xs`   | 13px | 18px |
| `text-sm`   | 15px | 22px |
| `text-base` | 17px | 26px |
| `text-lg`   | 18px | 28px |
| `text-xl`   | 20px | 30px |
| `text-2xl`  | 26px | 32px |

**Font weights:**
- `400` — body text
- `500` — labels, buttons, sidebar items
- `600` — section titles, active nav, badges
- `700` — page titles, metric values

---

## Spacing

Use Tailwind's default spacing scale (`p-3` = 12px, `p-4` = 16px, …).
The design system assumes these multiples throughout:

- **4 / 8** — inline gaps between icon and label
- **12 / 16** — card padding, list row padding
- **20 / 24** — card body padding, page header padding
- **32 / 40** — major section gaps

---

## Layout constants

| Token | Value | Overridable? |
|---|---|---|
| `--sidebar-width` | 232px | Yes (per-app) |
| `--sidebar-width-collapsed` | 56px | Yes |
| `--topbar-height` | 48px | Yes |
| `--mobile-topbar-height` | 52px | Yes |

Override these in a consumer app by setting the variable on a more
specific selector (e.g. `.my-app { --sidebar-width: 260px; }`).

---

## Control heights

| Token | Value | Use |
|---|---|---|
| `--control-height-sm` | 28px | Dense toolbars, inline controls |
| `--control-height-md` | 34px | Standard forms, top bar |
| `--control-height-lg` | 40px | Primary CTAs, modal footers |

All buttons, inputs, and selects follow these heights for visual rhythm.

---

## How to change the brand color

1. Open `src/theme.css`
2. Edit the six `--brand-*` values under `:root` (light mode)
3. Edit the six `--brand-*` values under `[data-theme="dark"]` (usually
   brighter, less saturated versions)
4. Restart consumer app dev servers

Every semantic `--color-primary*` reference in every component will
re-resolve, including hover states, focus rings, active sidebar items,
metric card stripes, primary badges, and links.

---

## Known shade divergence — `--border`/`--secondary`/`--border-strong` (tracked, not yet resolved)

`--border` (gray-150, `#DFE3EA`) and `--secondary` (gray-150, `#DFE3EA`) predate the §4.2 design-spec
reconciliation (v4.1.0) and are **intentionally not aliased** to their spec-named counterparts:

| Legacy name  | Legacy value        | Spec-named equivalent | Spec value           |
|---|---|---|---|
| `--border`    | gray-150 `#DFE3EA` | `--border-default`     | gray-200 `#CFD5DE`   |
| `--secondary` | gray-150 `#DFE3EA` | `--action-secondary`   | gray-100 `#ECEFF3`   |
| `--border-strong` | `#C3CAD5` (not a named gray step) | (no spec-named equivalent defined — spec's `--border-strong` is gray-300 `#B5BDC9`) | gray-300 `#B5BDC9` |

Unlike `--border`/`--secondary`, the `--border-strong` divergence was not a deliberate deferral: it is a
pre-existing mismatch that went undetected until this release's final whole-branch review (a 4.1.0 comment
had asserted it was spec-compliant), and it is disclosed here rather than left silently mislabeled.

Repointing either legacy name to its spec equivalent would silently reflow every default input
border and every secondary button/chip in every consumer of this package — a visual change under
a name nobody bumped a major version for. **Do not do this in a patch or minor release.**

The long-term canonical shade for each pair is an explicit design decision, made deliberately and
visually reviewed against the live consumer(s) — never auto-inherited from the v0.1 design export.
Until that decision lands (tracked in a follow-up issue — see CHANGELOG 4.1.0), **new code should
prefer the spec-named tokens** (`--border-default`, `--action-secondary`) for anything new, and
leave `--border`/`--secondary` alone where they're already in use.
