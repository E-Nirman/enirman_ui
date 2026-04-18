<template>
  <button
    :type="type"
    :disabled="disabled"
    :aria-label="label"
    :title="tooltip || label"
    class="eui-icon-btn"
    :class="[`eui-icon-btn--${size}`, `eui-icon-btn--${variant}`, { 'eui-icon-btn--active': active }]"
    @click="$emit('click', $event)"
  >
    <span v-if="badge" class="eui-icon-btn__badge">{{ badge }}</span>
    <component v-if="icon" :is="icon" class="eui-icon-btn__icon" aria-hidden="true" />
    <slot />
  </button>
</template>

<script setup>
/*
 * EuiIconButton — square button for icons only (toolbars, top bars).
 *
 * Sizes: sm (28), md (34, default), lg (40)
 * Variants: ghost (default), subtle, solid
 * `badge` — small red badge for notification counts
 */
defineProps({
  icon:    { type: [Object, Function], default: null },
  label:   { type: String, default: '' },
  tooltip: { type: String, default: '' },
  size:    { type: String, default: 'md' },
  variant: { type: String, default: 'ghost' },
  type:    { type: String, default: 'button' },
  disabled:{ type: Boolean, default: false },
  active:  { type: Boolean, default: false },
  badge:   { type: [String, Number], default: null },
})
defineEmits(['click'])
</script>

<style scoped>
.eui-icon-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  background: transparent;
  color: var(--ink-gray-7);
  cursor: pointer;
  transition: background-color .15s, color .15s, border-color .15s;
  flex-shrink: 0;
}
.eui-icon-btn:disabled { opacity: .45; cursor: not-allowed; }
.eui-icon-btn__icon { width: 17px; height: 17px; }

.eui-icon-btn--sm { width: 28px; height: 28px; }
.eui-icon-btn--sm .eui-icon-btn__icon { width: 15px; height: 15px; }
.eui-icon-btn--md { width: 34px; height: 34px; }
.eui-icon-btn--lg { width: 40px; height: 40px; }
.eui-icon-btn--lg .eui-icon-btn__icon { width: 19px; height: 19px; }

.eui-icon-btn--ghost:hover:not(:disabled) { background: var(--surface-gray-2); color: var(--ink-gray-9); }
.eui-icon-btn--subtle { background: var(--surface-gray-1); }
.eui-icon-btn--subtle:hover:not(:disabled) { background: var(--surface-gray-2); color: var(--ink-gray-9); }
.eui-icon-btn--solid { background: var(--color-primary); color: #fff; }
.eui-icon-btn--solid:hover:not(:disabled) { background: var(--color-primary-hover); }

.eui-icon-btn--active { background: var(--color-primary-subtle); color: var(--color-primary-ink); }

.eui-icon-btn__badge {
  position: absolute;
  top: 3px;
  right: 3px;
  min-width: 14px;
  height: 14px;
  padding: 0 3px;
  background: var(--color-danger);
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  border-radius: var(--radius-full);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  border: 1.5px solid var(--surface-white);
}
</style>
