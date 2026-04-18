<template>
  <component
    :is="tag"
    :to="to"
    :href="href"
    :type="tag === 'button' ? 'button' : undefined"
    class="eui-sidenav-item"
    :class="{ 'eui-sidenav-item--active': isActive, 'eui-sidenav-item--collapsed': collapsed, 'eui-sidenav-item--child': child }"
    :title="collapsed ? label : undefined"
    @click="$emit('click', $event)"
  >
    <span class="eui-sidenav-item__icon-wrap">
      <component v-if="icon" :is="icon" class="eui-sidenav-item__icon" aria-hidden="true" />
      <slot name="icon" />
    </span>
    <span v-if="!collapsed" class="eui-sidenav-item__label">{{ label }}</span>
    <span v-if="!collapsed && badge" class="eui-sidenav-item__badge">{{ badge }}</span>
    <svg v-if="!collapsed && chevron" class="eui-sidenav-item__chevron" :class="{ 'eui-sidenav-item__chevron--open': chevronOpen }" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4 6 L8 10 L12 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

/*
 * EuiSidebarItem — a single nav row in the sidebar.
 *
 * When `to` is passed it renders as router-link; when `href` as <a>; else <button>.
 *
 * Props:
 *   label, icon, to, href, badge, collapsed
 *   child    — true for sub-items (indented + smaller)
 *   active   — force active state (else matched against route)
 *   chevron / chevronOpen — for expandable group headers
 */

const props = defineProps({
  label: { type: String, required: true },
  icon:  { type: [Object, Function], default: null },
  to:    { type: [String, Object], default: null },
  href:  { type: String, default: null },
  badge: { type: [String, Number], default: null },
  collapsed: { type: Boolean, default: false },
  child:    { type: Boolean, default: false },
  active:   { type: Boolean, default: null },
  chevron:  { type: Boolean, default: false },
  chevronOpen: { type: Boolean, default: false },
  exact:    { type: Boolean, default: false },
})

defineEmits(['click'])

const route = useRoute()
const tag = computed(() => (props.to ? 'router-link' : props.href ? 'a' : 'button'))

const isActive = computed(() => {
  if (props.active !== null) return props.active
  if (!props.to) return false
  const target = typeof props.to === 'string' ? props.to : props.to?.path
  if (!target) return false
  if (props.exact) return route.path === target
  return route.path === target || route.path.startsWith(target + '/')
})
</script>

<style scoped>
.eui-sidenav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 34px;
  padding: 0 10px;
  margin: 1px 0;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-gray-7);
  background: transparent;
  border: none;
  cursor: pointer;
  text-decoration: none;
  text-align: left;
  transition: background-color .12s, color .12s;
  white-space: nowrap;
}
.eui-sidenav-item:hover { background: var(--surface-gray-2); color: var(--ink-gray-9); }
.eui-sidenav-item--active {
  background: var(--color-primary-subtle);
  color: var(--color-primary-ink);
  font-weight: 600;
}
.eui-sidenav-item--active:hover { background: var(--color-primary-subtle); }
.eui-sidenav-item--child { padding-left: 30px; height: 30px; font-size: 12.5px; font-weight: 400; }
.eui-sidenav-item--child .eui-sidenav-item__icon { width: 14px; height: 14px; }
.eui-sidenav-item--collapsed { justify-content: center; padding: 0; width: 36px; margin: 1px auto; }

.eui-sidenav-item__icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px; height: 16px;
  flex-shrink: 0;
  color: var(--ink-gray-6);
}
.eui-sidenav-item--active .eui-sidenav-item__icon-wrap { color: var(--color-primary-ink); }
.eui-sidenav-item__icon { width: 16px; height: 16px; }

.eui-sidenav-item__label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}
.eui-sidenav-item__badge {
  min-width: 18px;
  padding: 1px 6px;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
  background: var(--color-danger);
  color: #fff;
  border-radius: var(--radius-full);
}
.eui-sidenav-item--active .eui-sidenav-item__badge { background: var(--color-primary); }
.eui-sidenav-item__chevron { width: 12px; height: 12px; color: var(--ink-gray-4); transition: transform .15s; flex-shrink: 0; }
.eui-sidenav-item__chevron--open { transform: rotate(180deg); }
</style>
