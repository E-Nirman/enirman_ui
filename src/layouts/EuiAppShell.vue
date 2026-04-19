<template>
  <div class="eui-shell" :class="{ 'eui-shell--collapsed': collapsed }">
    <!-- Desktop sidebar -->
    <aside v-if="isDesktop" class="eui-shell__sidebar" :aria-expanded="!collapsed">
      <slot name="sidebar" :collapsed="collapsed" :toggle="toggleCollapse" :mobile="false" />
    </aside>

    <!-- Mobile drawer overlay -->
    <Transition name="eui-shell-backdrop">
      <div v-if="!isDesktop && mobileOpen" class="eui-shell__backdrop" @click="closeMobile" aria-hidden="true" />
    </Transition>
    <Transition name="eui-shell-drawer">
      <aside v-if="!isDesktop && mobileOpen" class="eui-shell__drawer">
        <div class="eui-shell__drawer-close-row">
          <button class="eui-shell__drawer-close" type="button" aria-label="Close menu" @click="closeMobile">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <path d="M3.5 3.5 L12.5 12.5 M12.5 3.5 L3.5 12.5" stroke-linecap="round" />
            </svg>
          </button>
        </div>
        <slot name="sidebar" :collapsed="false" :toggle="() => {}" :mobile="true" />
      </aside>
    </Transition>

    <!-- Main column -->
    <div class="eui-shell__main">
      <!-- Top bar -->
      <header class="eui-shell__topbar">
        <button
          v-if="!isDesktop"
          class="eui-shell__menu-btn"
          type="button"
          aria-label="Open menu"
          @click="mobileOpen = true"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <path d="M2.5 4 H13.5 M2.5 8 H13.5 M2.5 12 H13.5" stroke-linecap="round" />
          </svg>
        </button>
        <div class="eui-shell__topbar-left">
          <slot name="topbar-left">
            <strong v-if="!isDesktop" class="eui-shell__brand">{{ brand }}</strong>
          </slot>
        </div>
        <div class="eui-shell__topbar-center">
          <slot name="topbar-center" />
        </div>
        <div class="eui-shell__topbar-right">
          <slot name="topbar-right" />
        </div>
      </header>

      <!-- Banner strip (for grace warnings, quota alerts, etc.) -->
      <div v-if="$slots.banner" class="eui-shell__banner">
        <slot name="banner" />
      </div>

      <!-- Page content -->
      <main class="eui-shell__content" :class="{ 'eui-shell__content--flush': flush }">
        <slot />
      </main>
    </div>

    <!-- Overlays teleported by consumer (toasts, global dialogs) -->
    <slot name="overlay" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBreakpoint } from '../composables/useBreakpoint.js'

/*
 * EuiAppShell — canonical application chrome.
 *
 * Provides:
 *   - Persistent sidebar on desktop (collapsible, stored in localStorage)
 *   - Slide-in hamburger drawer on mobile (closes on route change)
 *   - Sticky top bar with slotted left / center / right zones
 *   - Optional banner zone below the top bar (payment overdue, quotas, etc.)
 *
 * Slots:
 *   #sidebar     — receives { collapsed, toggle, mobile } scope
 *   #topbar-left / #topbar-center / #topbar-right
 *   #banner      — optional strip below top bar
 *   default      — page content
 *   #overlay     — teleport zone for page-level overlays
 *
 * Props:
 *   brand       — app name shown in mobile top bar
 *   flush       — remove default content padding (page owns its layout)
 *   storageKey  — localStorage key for collapsed state (default 'enirman_sidebar_collapsed')
 */

const props = defineProps({
  brand:      { type: String, default: 'eNirman' },
  flush:      { type: Boolean, default: false },
  storageKey: { type: String, default: 'enirman_sidebar_collapsed' },
})

const { isDesktop } = useBreakpoint()
const route = useRoute()

const collapsed = ref(false)
const mobileOpen = ref(false)

onMounted(() => {
  try {
    const stored = localStorage.getItem(props.storageKey)
    if (stored === 'true') collapsed.value = true
  } catch { /* ignore */ }
})

function toggleCollapse() {
  collapsed.value = !collapsed.value
  try { localStorage.setItem(props.storageKey, String(collapsed.value)) } catch {}
}

function closeMobile() { mobileOpen.value = false }

// Close mobile drawer on navigation
watch(() => route.fullPath, () => { mobileOpen.value = false })

// Escape closes mobile drawer
function onKey(e) { if (e.key === 'Escape' && mobileOpen.value) mobileOpen.value = false }
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))

defineExpose({ collapsed, toggleCollapse, mobileOpen })
</script>

<style scoped>
.eui-shell {
  display: flex;
  height: 100dvh;
  width: 100vw;
  overflow: hidden;
  background: var(--surface-white);
  color: var(--ink-gray-9);
}

.eui-shell__sidebar {
  width: var(--sidebar-width);
  flex-shrink: 0;
  background: var(--surface-menu-bar);
  border-right: 1px solid var(--surface-gray-2);
  display: flex;
  flex-direction: column;
  overflow: visible;
  position: relative;
  transition: width .22s cubic-bezier(.4,0,.2,1);
}
.eui-shell--collapsed .eui-shell__sidebar {
  width: var(--sidebar-width-collapsed);
}

.eui-shell__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.eui-shell__topbar {
  display: flex;
  align-items: center;
  gap: 12px;
  height: var(--topbar-height);
  padding: 0 16px;
  border-bottom: 1px solid var(--surface-gray-2);
  background: var(--surface-white);
  flex-shrink: 0;
}
@media (max-width: 767px) {
  .eui-shell__topbar { height: var(--mobile-topbar-height); padding: 0 12px; }
}
.eui-shell__menu-btn {
  width: 34px; height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background: transparent;
  border: 1px solid transparent;
  color: var(--ink-gray-7);
  cursor: pointer;
  flex-shrink: 0;
}
.eui-shell__menu-btn:hover { background: var(--surface-gray-2); }
.eui-shell__menu-btn svg { width: 18px; height: 18px; }

.eui-shell__topbar-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.eui-shell__topbar-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
}
.eui-shell__topbar-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}
.eui-shell__brand {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink-gray-9);
}

.eui-shell__banner { flex-shrink: 0; }

.eui-shell__content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
}
.eui-shell__content--flush > * { max-width: none; }

/* Mobile drawer */
.eui-shell__backdrop {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 0.45);
  z-index: 80;
}
.eui-shell__drawer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: min(84vw, 300px);
  background: var(--surface-menu-bar);
  border-right: 1px solid var(--surface-gray-2);
  z-index: 90;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow-xl);
}
.eui-shell__drawer-close-row {
  display: flex;
  justify-content: flex-end;
  padding: 8px 10px 0;
}
.eui-shell__drawer-close {
  width: 28px; height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  background: transparent;
  border: none;
  color: var(--ink-gray-6);
  cursor: pointer;
}
.eui-shell__drawer-close:hover { background: var(--surface-gray-2); color: var(--ink-gray-9); }
.eui-shell__drawer-close svg { width: 14px; height: 14px; }

.eui-shell-backdrop-enter-active, .eui-shell-backdrop-leave-active { transition: opacity .2s; }
.eui-shell-backdrop-enter-from, .eui-shell-backdrop-leave-to { opacity: 0; }

.eui-shell-drawer-enter-active, .eui-shell-drawer-leave-active { transition: transform .25s cubic-bezier(.4,0,.2,1); }
.eui-shell-drawer-enter-from, .eui-shell-drawer-leave-to { transform: translateX(-100%); }
</style>
