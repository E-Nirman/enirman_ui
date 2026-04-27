<script setup>
import { useRoute, useRouter } from 'vue-router'
import { cn } from '../../../lib/utils.js'

/**
 * EuiTopTabs — tab strip for project-scoped navigation.
 * Renders disabled when `disabled` is true. Active tab matches route.path
 * exactly OR is its prefix (so detail routes still light their list tab).
 *
 * Props:
 *   tabs: [{ key, label, to, badge?: number }]
 *   disabled: bool
 */
const props = defineProps({
  tabs: { type: Array, required: true },
  disabled: { type: Boolean, default: false },
})

const route = useRoute()
const router = useRouter()

const isActive = (tab) => route.path === tab.to || route.path.startsWith(tab.to + '/')

function go(tab) {
  if (props.disabled) return
  router.push({ path: tab.to, query: { ...route.query } })
}
</script>

<template>
  <nav
    class="flex items-center gap-1 h-9 overflow-x-auto"
    :class="disabled && 'opacity-50 pointer-events-none'"
    role="tablist"
  >
    <button
      v-for="tab in tabs"
      :key="tab.key"
      type="button"
      role="tab"
      :aria-selected="isActive(tab)"
      :class="cn(
        'h-7 px-3 inline-flex items-center gap-1.5 rounded-md text-[12.5px] font-medium whitespace-nowrap',
        'border border-transparent transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        isActive(tab)
          ? 'bg-foreground text-background'
          : 'text-muted-foreground',
      )"
      @click="go(tab)"
    >
      <span>{{ tab.label }}</span>
      <span
        v-if="tab.badge"
        :class="cn(
          'inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-mono',
          isActive(tab) ? 'bg-background text-foreground' : 'bg-muted text-foreground',
        )"
      >{{ tab.badge }}</span>
    </button>
  </nav>
</template>
