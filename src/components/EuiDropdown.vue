<template>
  <div ref="rootRef" class="eui-dropdown">
    <div class="eui-dropdown__trigger" @click="toggle">
      <slot name="trigger" :open="open" :toggle="toggle" />
    </div>
    <Transition name="eui-dropdown">
      <div
        v-if="open"
        class="eui-dropdown__menu"
        :class="[`eui-dropdown__menu--${placement}`, { 'eui-dropdown__menu--wide': wide }]"
        role="menu"
      >
        <template v-if="items && items.length">
          <template v-for="(item, idx) in items" :key="item.key || item.label || idx">
            <div v-if="item.divider" class="eui-dropdown__divider" />
            <div v-else-if="item.header" class="eui-dropdown__header">{{ item.header }}</div>
            <component
              v-else
              :is="item.to ? 'router-link' : item.href ? 'a' : 'button'"
              :type="!item.to && !item.href ? 'button' : undefined"
              :to="item.to"
              :href="item.href"
              class="eui-dropdown__item"
              :class="[{ 'eui-dropdown__item--danger': item.danger, 'eui-dropdown__item--active': item.active }]"
              :disabled="item.disabled"
              role="menuitem"
              @click="handleItemClick(item)"
            >
              <component v-if="item.icon" :is="item.icon" class="eui-dropdown__item-icon" aria-hidden="true" />
              <span class="eui-dropdown__item-label">{{ item.label }}</span>
              <span v-if="item.shortcut" class="eui-dropdown__item-shortcut">{{ item.shortcut }}</span>
            </component>
          </template>
        </template>
        <slot :close="close" />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

/*
 * EuiDropdown — contextual menu.
 *
 * Usage A (items array):
 *   <EuiDropdown :items="[{ label: 'Edit', icon: X, onClick: fn }, { divider: true }, ...]">
 *     <template #trigger="{ toggle }"><button @click="toggle">•••</button></template>
 *   </EuiDropdown>
 *
 * Usage B (custom content):
 *   <EuiDropdown>
 *     <template #trigger>…</template>
 *     <template #default="{ close }">…</template>
 *   </EuiDropdown>
 *
 * Item shape: { label, icon?, onClick?, to?, href?, disabled?, danger?, active?, shortcut?, divider?, header? }
 */

const props = defineProps({
  items:     { type: Array, default: () => [] },
  placement: { type: String, default: 'bottom-start' },
  wide:      { type: Boolean, default: false },
})
const emit = defineEmits(['open', 'close'])

const open = ref(false)
const rootRef = ref(null)

function toggle() { open.value ? close() : openMenu() }
function openMenu() { open.value = true; emit('open') }
function close() { open.value = false; emit('close') }

function handleItemClick(item) {
  if (item.disabled) return
  item.onClick?.(item)
  if (item.closeOnClick !== false) close()
}

function onDocClick(e) {
  if (!rootRef.value) return
  if (!rootRef.value.contains(e.target)) close()
}
function onKey(e) { if (e.key === 'Escape') close() }

onMounted(() => {
  document.addEventListener('mousedown', onDocClick)
  document.addEventListener('keydown', onKey)
})
onUnmounted(() => {
  document.removeEventListener('mousedown', onDocClick)
  document.removeEventListener('keydown', onKey)
})

defineExpose({ open, toggle, close })
</script>

<style scoped>
.eui-dropdown { position: relative; display: inline-block; }
.eui-dropdown__trigger { display: inline-flex; }
.eui-dropdown__menu {
  position: absolute;
  z-index: 60;
  min-width: 200px;
  padding: 4px;
  background: var(--surface-white);
  border: 1px solid var(--surface-gray-3);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-pop);
  display: flex;
  flex-direction: column;
  gap: 1px;
}
[data-theme="dark"] .eui-dropdown__menu { background: var(--surface-modal); }

.eui-dropdown__menu--wide { min-width: 260px; }

.eui-dropdown__menu--bottom-start { top: calc(100% + 4px); left: 0; }
.eui-dropdown__menu--bottom-end   { top: calc(100% + 4px); right: 0; }
.eui-dropdown__menu--top-start    { bottom: calc(100% + 4px); left: 0; }
.eui-dropdown__menu--top-end      { bottom: calc(100% + 4px); right: 0; }
.eui-dropdown__menu--right-start  { left: calc(100% + 4px); top: 0; }

.eui-dropdown__item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 7px 10px;
  border-radius: var(--radius-sm);
  background: transparent;
  border: none;
  color: var(--ink-gray-8);
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  text-decoration: none;
  transition: background-color .1s;
}
.eui-dropdown__item:hover:not(:disabled) { background: var(--surface-gray-2); }
.eui-dropdown__item:disabled { opacity: .45; cursor: not-allowed; }
.eui-dropdown__item--active { background: var(--color-primary-subtle); color: var(--color-primary-ink); }
.eui-dropdown__item--danger { color: var(--color-danger-ink); }
.eui-dropdown__item--danger:hover:not(:disabled) { background: var(--color-danger-subtle); }

.eui-dropdown__item-icon { width: 15px; height: 15px; color: var(--ink-gray-5); flex-shrink: 0; }
.eui-dropdown__item--danger .eui-dropdown__item-icon { color: var(--color-danger-ink); }
.eui-dropdown__item-label { flex: 1; }
.eui-dropdown__item-shortcut {
  font-size: 11px;
  color: var(--ink-gray-4);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

.eui-dropdown__header {
  padding: 6px 10px 2px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .06em;
  color: var(--ink-gray-4);
}
.eui-dropdown__divider {
  height: 1px;
  margin: 4px 0;
  background: var(--surface-gray-2);
}

/* Transition */
.eui-dropdown-enter-active, .eui-dropdown-leave-active { transition: transform .12s, opacity .12s; transform-origin: top left; }
.eui-dropdown-enter-from, .eui-dropdown-leave-to { opacity: 0; transform: scale(.97) translateY(-4px); }
</style>
