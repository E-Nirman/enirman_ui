# Using enirman-ui in a new app

`enirman-ui` is the shared design system for all eNirman Vue apps. This doc
walks through wiring it into a fresh frontend package.

---

## 1. Install

The package is published on GitHub at
[E-Nirman/enirman_ui](https://github.com/E-Nirman/enirman_ui). Install it
via yarn's git-protocol support — no npm publishing required:

```json
// apps/<your-app>/frontend/package.json
{
  "dependencies": {
    "enirman-ui": "git+https://github.com/E-Nirman/enirman_ui.git#master",
    "frappe-ui": "latest",
    "vue": "^3.4.0",
    "vue-router": "^4.0.0",
    "@vueuse/core": "^11.0.0"
  }
}
```

Pin to a tag (`#v0.1.0`) or commit SHA for reproducible deploys.

Then `yarn install`. Yarn clones the repo into `node_modules/enirman-ui`.

### Local development against a branch of enirman_ui

When you're actively editing `enirman_ui` and want instant updates in a
consumer app without pushing, use `yarn link`:

```bash
cd ~/frappe-bench/apps/enirman_ui
yarn link

cd ~/frappe-bench/apps/<your-app>/frontend
yarn link enirman-ui
```

`yarn unlink enirman-ui` + `yarn install` reverts to the pinned version.

## 2. Wire Tailwind

`enirman-ui` ships a Tailwind preset that extends frappe-ui's preset with
our color tokens, radii, shadows, and the `xs` breakpoint.

```js
// apps/<your-app>/frontend/tailwind.config.js
import frappeUIPreset from 'frappe-ui/tailwind'
import enirmanPreset from 'enirman-ui/tailwind-preset'

export default {
  presets: [frappeUIPreset, enirmanPreset],
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/frappe-ui/src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/enirman-ui/src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  plugins: [],
}
```

## 3. Import the theme

Import `theme.css` once in your app entry, after frappe-ui's style:

```js
// apps/<your-app>/frontend/src/main.js
import 'frappe-ui/style.css'
import 'enirman-ui/theme.css'
import './index.css'
// …rest of your app setup
```

`theme.css` defines every CSS variable the design system reads —
`--color-primary`, `--surface-*`, `--ink-*`, `--radius-*`, `--shadow-*`,
`--sidebar-width`, etc. — for both light and dark mode.

## 4. Wrap your app with the shell

Use `EuiAppShell` for the chrome and `EuiPageHeader` on every page.

```vue
<script setup>
import { EuiAppShell, EuiSidebarItem, EuiSidebarSection, useTheme } from 'enirman-ui'
import LucideHome from '~icons/lucide/home'
import LucideSettings from '~icons/lucide/settings'

useTheme()  // installs theme persistence + system preference fallback
</script>

<template>
  <EuiAppShell brand="My App">
    <template #sidebar="{ collapsed }">
      <EuiSidebarSection :collapsed="collapsed" :divider="false">
        <EuiSidebarItem label="Dashboard" :icon="LucideHome" to="/" :collapsed="collapsed" />
        <EuiSidebarItem label="Settings" :icon="LucideSettings" to="/settings" :collapsed="collapsed" />
      </EuiSidebarSection>
    </template>

    <template #topbar-right>
      <!-- your notification bell, user menu, etc. -->
    </template>

    <router-view />
  </EuiAppShell>
</template>
```

Every page then starts with a `<EuiPageHeader>`:

```vue
<template>
  <EuiPageHeader title="Projects" subtitle="Manage all active projects" />
  <div class="p-6">
    <!-- page body -->
  </div>
</template>
```

## 5. Dark mode

`useTheme()` installs the theme switcher. It:

- Reads `localStorage['enirman_theme']` on mount (`'light' | 'dark'`)
- Falls back to `prefers-color-scheme: dark` on first load
- Sets `data-theme="dark"` on `<html>` so every CSS variable override
  kicks in automatically.

To let the user toggle:

```vue
<script setup>
import { useTheme, EuiIconButton } from 'enirman-ui'
import LucideMoon from '~icons/lucide/moon'
import LucideSun from '~icons/lucide/sun'
const { theme, toggle } = useTheme()
</script>

<template>
  <EuiIconButton :icon="theme === 'dark' ? LucideSun : LucideMoon" label="Toggle theme" @click="toggle" />
</template>
```

### Brand (5.3.0)

`useTheme()` also owns the **brand axis**, which is orthogonal to the
theme: a separate ref (`brand`), a separate setter (`setBrand`), a
separate storage key (`localStorage['enirman-brand']`), and a separate
attribute (`data-brand="aec" | "estate"` on `<html>`). Setting one axis
never touches the other.

- Default brand is `aec`. A consumer that never calls `setBrand` renders
  exactly what it rendered before the brand axis existed — `:root` still
  carries the AEC tokens, and `[data-brand="aec"]` is just the explicit
  spelling of the same block.
- `setBrand('estate')` switches to the Estate brand file
  (`src/brands/estate.css`), which overrides only brand-axis tokens —
  brand surface, action, link, focus, sidebar, shadow tint — and inherits
  everything else from the AEC blocks.
- Unknown values are ignored (`setBrand('studio')` is a no-op).

```js
const { brand, setBrand } = useTheme()
setBrand('estate')   // <html data-brand="estate">; theme untouched
```

`darkMode` in the Tailwind preset stays keyed to `[data-theme="dark"]`;
the brand attribute is CSS-only and never affects `dark:` variants.

## 6. Icons

The design system keeps icon choice to the consumer (we don't want to
bundle a specific icon set). All existing apps use
[unplugin-icons](https://github.com/unplugin/unplugin-icons) with lucide
icons — the frappe-ui vite plugin enables this out of the box with
`lucideIcons: true`. Import as:

```js
import LucideSearch from '~icons/lucide/search'
```

## 7. Rebranding

Brands live in `src/brands/*.css` and are selected at runtime with
`data-brand` (see §5 above). To add or adjust a brand:

1. Edit (or add) `apps/enirman_ui/src/brands/<brand>.css` and import it
   from `src/theme.css` after `brands/aec.css`.
2. A brand file overrides **only brand-axis tokens** — brand surface
   (`--bg-brand`, `--border-brand`, `--bg-inverse`), action
   (`--action-primary*`, `--accent*`), link (`--fg-link*`), focus
   (`--border-focus`, `--shadow-focus`), sidebar (`--sidebar-*`) and the
   shadow tint. Everything else inherits from the AEC `:root` /
   `[data-theme="dark"]` blocks.
3. Give the brand a light block (`[data-brand="x"]`) and a dark block
   (`[data-brand="x"][data-theme="dark"]`). Any token the light block
   declares that the AEC dark block *also* tunes must be re-declared in
   the brand's dark block — the two selectors have equal specificity and
   the light brand block sits later in source order than the AEC dark
   block, so it would otherwise win in dark mode. See "Cascade rule" in
   `docs/DESIGN_TOKENS.md`. A brand file overrides theme-axis tokens only
   under the documented exception listed there (Estate's slate ladder).
4. Never change a value under an existing name in `brands/aec.css` —
   that is a major, not a brand addition.

No JS rebuild is needed in the design system itself; consumers just need
to restart their dev server.

## 8. Where to read next

- `docs/DESIGN_TOKENS.md` — every token and what it means
- `docs/COMPONENTS.md` — rules, variants, and sizes for every component
