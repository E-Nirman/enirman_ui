<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBreakpoint } from '../composables/useBreakpoint.js'
import { Menu } from 'lucide-vue-next'
import { Sheet, SheetContent } from '../components/ui/sheet/index.js'
import { Button } from '../components/ui/button/index.js'

/*
 * AppShell — canonical application chrome for every consumer app.
 *
 * Layout:
 *   Desktop: [sidebar (collapsible to icons) | [topbar / content]]
 *   Mobile:  [topbar w/ hamburger] → tapping opens sidebar in a sheet
 *
 * Sidebar collapse state persists in localStorage; can be toggled by
 * user or forced collapsed via prop.
 *
 * Slots:
 *   #sidebar  (scoped: { collapsed, toggle, mobile })
 *   #topbar   (scoped: { collapsed, toggleSidebar })
 *   #banner   (full-width strip under topbar — for payment banners)
 *   default   (page content)
 *   #overlay  (teleport target for page-level popovers/toasts)
 */

const props = defineProps({
  storageKey:    { type: String, default: 'enirman_sidebar_collapsed' },
  defaultCollapsed: { type: Boolean, default: false },
  class:         { type: [String, Array, Object], default: '' },
})

const { isDesktop } = useBreakpoint()
const route = useRoute()

const collapsed = ref(props.defaultCollapsed)
const mobileOpen = ref(false)

onMounted(() => {
  try {
    const stored = localStorage.getItem(props.storageKey)
    if (stored === 'true') collapsed.value = true
    else if (stored === 'false') collapsed.value = false
  } catch {}
})

function toggleCollapse() {
  collapsed.value = !collapsed.value
  try { localStorage.setItem(props.storageKey, String(collapsed.value)) } catch {}
}

function openMobile() { mobileOpen.value = true }

// Close mobile sheet on route change
watch(() => route.fullPath, () => { mobileOpen.value = false })

// Close on Escape
function onKey(e) {
  if (e.key === 'Escape' && mobileOpen.value) mobileOpen.value = false
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))

const sidebarWidth = computed(() =>
  collapsed.value ? 'w-[56px]' : 'w-[240px]'
)
</script>

<template>
  <div class="relative flex h-dvh w-screen bg-background text-foreground">
    <!-- Desktop sidebar -->
    <aside
      v-if="isDesktop"
      :class="[
        'group relative flex shrink-0 flex-col bg-sidebar border-r border-sidebar-border transition-[width] duration-200 ease-out',
        sidebarWidth,
      ]"
      :data-collapsed="collapsed"
    >
      <slot name="sidebar" :collapsed="collapsed" :toggle="toggleCollapse" :mobile="false" />
    </aside>

    <!-- Mobile sidebar sheet -->
    <Sheet v-if="!isDesktop" :open="mobileOpen" @update:open="mobileOpen = $event">
      <SheetContent side="left" class="p-0 w-[260px]" :show-close="false">
        <div class="flex h-full flex-col bg-sidebar text-sidebar-foreground">
          <slot name="sidebar" :collapsed="false" :toggle="() => {}" :mobile="true" />
        </div>
      </SheetContent>
    </Sheet>

    <!-- Main column -->
    <div class="flex min-w-0 flex-1 flex-col">
      <!-- Topbar -->
      <header class="flex h-[52px] shrink-0 items-center gap-2 border-b border-border bg-background px-3 sm:px-4">
        <Button
          v-if="!isDesktop"
          variant="ghost"
          size="icon-sm"
          class="-ml-1"
          aria-label="Open menu"
          @click="openMobile"
        >
          <Menu />
        </Button>
        <slot name="topbar" :collapsed="collapsed" :toggleSidebar="toggleCollapse" />
      </header>

      <!-- Banner zone -->
      <div v-if="$slots.banner" class="shrink-0">
        <slot name="banner" />
      </div>

      <!-- Scroll area -->
      <main class="flex-1 overflow-auto">
        <slot />
      </main>
    </div>

    <!-- Overlay slot -->
    <slot name="overlay" />
  </div>
</template>

<style scoped>
@media (min-width: 768px) {
  aside[data-collapsed="true"] :deep([data-hide-collapsed]) { display: none; }
  aside[data-collapsed="true"] :deep([data-show-collapsed]) { display: inline-flex; }
  aside[data-collapsed="false"] :deep([data-show-collapsed]) { display: none; }
}
</style>
