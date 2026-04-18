<template>
  <div class="eui-sidenav-section" :class="{ 'eui-sidenav-section--collapsed': collapsed }">
    <div v-if="collapsed && divider" class="eui-sidenav-section__rule" />
    <button
      v-if="!collapsed && label"
      type="button"
      class="eui-sidenav-section__label"
      :class="{ 'eui-sidenav-section__label--clickable': collapsible }"
      @click="handleToggle"
    >
      <span>{{ label }}</span>
      <svg v-if="collapsible" class="eui-sidenav-section__chevron" :class="{ 'eui-sidenav-section__chevron--open': expanded }" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M4 6 L8 10 L12 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
    <div v-if="expanded || collapsed" class="eui-sidenav-section__items">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

/*
 * EuiSidebarSection — groups sidebar items under a header label.
 *
 * Props:
 *   label       — section heading (hidden when collapsed)
 *   collapsible — adds a chevron toggle that collapses children
 *   defaultExpanded — initial state for collapsible sections
 *   divider     — adds a top border rule (used between groups)
 *   collapsed   — passed from parent when sidebar is icon-only
 */
const props = defineProps({
  label:      { type: String, default: '' },
  collapsible:{ type: Boolean, default: false },
  defaultExpanded: { type: Boolean, default: true },
  divider:    { type: Boolean, default: true },
  collapsed:  { type: Boolean, default: false },
})

const expanded = ref(props.defaultExpanded || !props.collapsible)
function handleToggle() { if (props.collapsible) expanded.value = !expanded.value }
</script>

<style scoped>
.eui-sidenav-section { padding: 6px 8px; border-top: 1px solid var(--surface-gray-2); margin-top: 4px; }
.eui-sidenav-section:first-child { border-top: none; margin-top: 0; }
.eui-sidenav-section--collapsed { padding: 6px 0; }

.eui-sidenav-section__rule {
  height: 1px;
  background: var(--surface-gray-2);
  margin: 4px 8px;
}

.eui-sidenav-section__label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 4px 10px 6px;
  font-size: 10.5px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .07em;
  color: var(--ink-gray-4);
  background: transparent;
  border: none;
  cursor: default;
}
.eui-sidenav-section__label--clickable { cursor: pointer; }
.eui-sidenav-section__label--clickable:hover { color: var(--ink-gray-6); }
.eui-sidenav-section__chevron {
  width: 11px; height: 11px;
  transition: transform .15s;
}
.eui-sidenav-section__chevron--open { transform: rotate(180deg); }

.eui-sidenav-section__items { display: flex; flex-direction: column; gap: 0; }
</style>
