# Using enirman-ui in a new app

`enirman-ui` is the shared design system for all eNirman Vue apps. This doc
walks through wiring it into a fresh frontend package.

---

## 1. Install

The package lives at `~/frappe-bench/apps/enirman_ui/`. Add it as a `file:`
dependency from your app's frontend:

```json
// apps/<your-app>/frontend/package.json
{
  "dependencies": {
    "enirman-ui": "file:../../enirman_ui",
    "frappe-ui": "latest",
    "vue": "^3.4.0",
    "vue-router": "^4.0.0",
    "@vueuse/core": "^11.0.0"
  }
}
```

Then `yarn install`. Yarn will symlink the package, so changes to
`enirman_ui` files are picked up immediately in dev.

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
    '../../enirman_ui/src/**/*.{vue,js,ts,jsx,tsx}',
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

To change the primary brand color across every consumer app:

1. Edit `apps/enirman_ui/src/theme.css`
2. Update `--brand-50 / 100 / 300 / 500 / 600 / 700` under `:root` and `[data-theme="dark"]`
3. That's it — every component re-derives its color from these six values

No other file changes. No JS rebuild needed in the design system itself;
consumers just need to restart their dev server.

## 8. Where to read next

- `docs/DESIGN_TOKENS.md` — every token and what it means
- `docs/COMPONENTS.md` — rules, variants, and sizes for every component
