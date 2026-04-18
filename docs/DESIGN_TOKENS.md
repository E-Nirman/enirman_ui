# Design Tokens

Every visual decision in enirman-ui resolves to a CSS variable. The
variables are defined in `src/theme.css` and re-exposed to Tailwind
utility classes by `tailwind-preset.js`. Tokens live in two scopes:
**brand tokens** (raw colors, change to rebrand) and **semantic tokens**
(named by purpose — most components read these).

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
