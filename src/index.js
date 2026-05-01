/*
 * enirman-ui v2 — single-entry exports.
 *
 * Primitives are re-exported from the shadcn-vue "ui/" components and
 * the enirman-specific "app/" composed layer sits on top. Layout
 * scaffolding (AppShell, SidebarItem, SidebarSection) ships alongside.
 *
 * Usage:
 *   import { Button, Card, CardHeader, CardTitle } from 'enirman-ui'
 *   import { AppShell, PageHeader, StatCard } from 'enirman-ui'
 *   import 'enirman-ui/theme.css'
 */

// ─── Primitive components (shadcn-vue style) ─────────────────────
export * from './components/ui/button/index.js'
export * from './components/ui/card/index.js'
export * from './components/ui/badge/index.js'
export * from './components/ui/input/index.js'
export * from './components/ui/label/index.js'
export * from './components/ui/textarea/index.js'
export * from './components/ui/avatar/index.js'
export * from './components/ui/dialog/index.js'
export * from './components/ui/tabs/index.js'
export * from './components/ui/dropdown-menu/index.js'
export * from './components/ui/tooltip/index.js'
export * from './components/ui/separator/index.js'
export * from './components/ui/skeleton/index.js'
export * from './components/ui/popover/index.js'
export * from './components/ui/sheet/index.js'
export * from './components/ui/command/index.js'
export * from './components/ui/switch/index.js'
export * from './components/ui/table/index.js'
export * from './components/ui/scroll-area/index.js'
export * from './components/ui/sonner/index.js'
export * from './components/ui/progress/index.js'
export * from './components/ui/spinner/index.js'

// ─── eNirman composed components ──────────────────────────────────
export { default as PageHeader }    from './components/app/PageHeader.vue'
export { default as PageContainer } from './components/app/PageContainer.vue'
export { default as StatCard }      from './components/app/StatCard.vue'
export { default as StatusBadge }   from './components/app/StatusBadge.vue'
export { default as EmptyState }    from './components/app/EmptyState.vue'
export { default as CommandPalette }from './components/app/CommandPalette.vue'
export { EuiDwgViewer }             from './components/app/EuiDwgViewer'
export { EuiFileViewer }            from './components/app/EuiFileViewer'
export { EuiStageBadge, EuiBlockBadge } from './components/app/EuiBadges'
export { EuiDesignItemCard }        from './components/app/EuiDesignItemCard'
export { EuiVersionTimeline }       from './components/app/EuiVersionTimeline'
export { EuiStatusFlow }            from './components/app/EuiStatusFlow'
export { EuiPhaseRail }             from './components/app/EuiPhaseRail'
export { EuiCategoryRail }          from './components/app/EuiCategoryRail'
export { EuiDesignItemList }        from './components/app/EuiDesignItemList'
export { EuiDesignItemPane }        from './components/app/EuiDesignItemPane'
export { EuiPhaseKanban }           from './components/app/EuiPhaseKanban'
export { EuiPhaseTable }            from './components/app/EuiPhaseTable'
export { EuiReviewCard }            from './components/app/EuiReviewCard'
export { EuiHandoffCard }           from './components/app/EuiHandoffCard'
export { EuiActivityFeed }          from './components/app/EuiActivityFeed'
export { EuiCdeStateBadge }         from './components/app/EuiCdeStateBadge'
export { EuiSparkline }             from './components/app/EuiSparkline'
export { EuiAvatarStack }           from './components/app/EuiAvatarStack'
export { EuiFeatureGate }           from './components/app/EuiFeatureGate'
export { DetailRow }                from './components/app/DetailRow'
export { InlineSelect }             from './components/app/InlineSelect'

// ─── Layouts ──────────────────────────────────────────────────────
export { default as AppShell }        from './layouts/AppShell.vue'
export { default as SidebarItem }     from './layouts/SidebarItem.vue'
export { default as SidebarSection }  from './layouts/SidebarSection.vue'

// ─── Composables ─────────────────────────────────────────────────
export { useTheme }           from './composables/useTheme.js'
export { useBreakpoint }      from './composables/useBreakpoint.js'
export { useCommandPalette }  from './composables/useCommandPalette.js'

// ─── Utilities ───────────────────────────────────────────────────
export { cn } from './lib/utils.js'

// ─── Brand assets (logo URLs, ready for <img :src>) ──────────────
export { logo, logoLight, logoMark } from './assets/index.js'
