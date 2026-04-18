<template>
  <span class="eui-status" :class="[`eui-status--${tone}`, `eui-status--${size}`, { 'eui-status--pulse': pulse }]">
    <span class="eui-status__dot" aria-hidden="true" />
    <span v-if="$slots.default" class="eui-status__label"><slot /></span>
  </span>
</template>

<script setup>
/*
 * EuiStatusDot — colored dot + optional label.
 *
 * Tones: neutral, brand, success, warning, danger, info, accent
 * `pulse` — animated pulse (use for "live" or "active" indicators)
 */
defineProps({
  tone:  { type: String, default: 'neutral' },
  size:  { type: String, default: 'md' },
  pulse: { type: Boolean, default: false },
})
</script>

<style scoped>
.eui-status { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--ink-gray-7); }
.eui-status--sm { font-size: 12px; gap: 5px; }
.eui-status__dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.eui-status--sm .eui-status__dot { width: 6px; height: 6px; }

.eui-status--neutral .eui-status__dot { background: var(--ink-gray-4); }
.eui-status--brand   .eui-status__dot { background: var(--color-primary); }
.eui-status--success .eui-status__dot { background: var(--color-success); }
.eui-status--warning .eui-status__dot { background: var(--color-warning); }
.eui-status--danger  .eui-status__dot { background: var(--color-danger); }
.eui-status--info    .eui-status__dot { background: var(--color-info); }
.eui-status--accent  .eui-status__dot { background: var(--color-accent); }

.eui-status--pulse .eui-status__dot {
  box-shadow: 0 0 0 0 currentColor;
  animation: eui-pulse 1.6s ease-out infinite;
  color: inherit;
}
.eui-status--pulse.eui-status--success .eui-status__dot { color: var(--color-success); }
.eui-status--pulse.eui-status--warning .eui-status__dot { color: var(--color-warning); }
.eui-status--pulse.eui-status--danger  .eui-status__dot { color: var(--color-danger); }

@keyframes eui-pulse {
  0%   { box-shadow: 0 0 0 0 rgb(from currentColor r g b / .5); }
  100% { box-shadow: 0 0 0 8px rgb(from currentColor r g b / 0); }
}
</style>
