/*
 * enirman-ui — single-entry exports.
 *
 * Usage:
 *   import { EuiButton, EuiCard, useTheme } from 'enirman-ui'
 *   import 'enirman-ui/theme.css'
 *
 * We use explicit named exports (rather than a plugin with auto-register)
 * so tree-shaking works and IDE auto-imports are precise. Consumers can
 * also cherry-pick via subpath exports — see package.json `exports`.
 */

// Components
export { default as EuiButton }      from './components/EuiButton.vue'
export { default as EuiIconButton }  from './components/EuiIconButton.vue'
export { default as EuiCard }        from './components/EuiCard.vue'
export { default as EuiSectionCard } from './components/EuiSectionCard.vue'
export { default as EuiBadge }       from './components/EuiBadge.vue'
export { default as EuiStatusDot }   from './components/EuiStatusDot.vue'
export { default as EuiInput }       from './components/EuiInput.vue'
export { default as EuiSearchInput } from './components/EuiSearchInput.vue'
export { default as EuiEmptyState }  from './components/EuiEmptyState.vue'
export { default as EuiMetricCard }  from './components/EuiMetricCard.vue'
export { default as EuiDialog }      from './components/EuiDialog.vue'
export { default as EuiTabs }        from './components/EuiTabs.vue'
export { default as EuiDropdown }    from './components/EuiDropdown.vue'
export { default as EuiSkeleton }    from './components/EuiSkeleton.vue'
export { default as EuiProgressBar } from './components/EuiProgressBar.vue'
export { default as EuiListRow }     from './components/EuiListRow.vue'
export { default as EuiPageHeader }  from './components/EuiPageHeader.vue'

// Layouts
export { default as EuiAppShell }       from './layouts/EuiAppShell.vue'
export { default as EuiSidebarItem }    from './layouts/EuiSidebarItem.vue'
export { default as EuiSidebarSection } from './layouts/EuiSidebarSection.vue'

// Composables
export { useTheme }      from './composables/useTheme.js'
export { useBreakpoint } from './composables/useBreakpoint.js'
