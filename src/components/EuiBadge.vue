<template>
  <span class="eui-badge" :class="[`eui-badge--${tone}`, `eui-badge--${size}`, { 'eui-badge--dot': dot, 'eui-badge--solid': solid }]">
    <span v-if="dotOnly || dot" class="eui-badge__dot" />
    <slot />
  </span>
</template>

<script setup>
/*
 * EuiBadge — status/category label.
 *
 * Tones: neutral, brand, success, warning, danger, info, accent
 * Sizes: sm, md (default)
 * `solid` — filled variant (use for prominent state chips)
 * `dot`   — prefix with a colored dot (status indicator)
 */
defineProps({
  tone: { type: String, default: 'neutral' },
  size: { type: String, default: 'md' },
  dot:  { type: Boolean, default: false },
  dotOnly: { type: Boolean, default: false },
  solid: { type: Boolean, default: false },
})
</script>

<style scoped>
.eui-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;
  border-radius: var(--radius-full);
  white-space: nowrap;
  line-height: 1;
}
.eui-badge--sm { padding: 2px 7px; font-size: 11px; }
.eui-badge--md { padding: 3px 9px; font-size: 12px; }

.eui-badge__dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}

.eui-badge--neutral { background: var(--surface-gray-2); color: var(--ink-gray-7); }
.eui-badge--brand   { background: var(--color-primary-subtle); color: var(--color-primary-ink); }
.eui-badge--success { background: var(--color-success-subtle); color: var(--color-success-ink); }
.eui-badge--warning { background: var(--color-warning-subtle); color: var(--color-warning-ink); }
.eui-badge--danger  { background: var(--color-danger-subtle);  color: var(--color-danger-ink); }
.eui-badge--info    { background: var(--color-info-subtle);    color: var(--color-info-ink); }
.eui-badge--accent  { background: var(--color-accent-subtle);  color: var(--color-accent-ink); }

.eui-badge--solid.eui-badge--brand   { background: var(--color-primary); color: #fff; }
.eui-badge--solid.eui-badge--success { background: var(--color-success); color: #fff; }
.eui-badge--solid.eui-badge--warning { background: var(--color-warning); color: #fff; }
.eui-badge--solid.eui-badge--danger  { background: var(--color-danger);  color: #fff; }
.eui-badge--solid.eui-badge--info    { background: var(--color-info);    color: #fff; }
.eui-badge--solid.eui-badge--accent  { background: var(--color-accent);  color: #fff; }
.eui-badge--solid.eui-badge--neutral { background: var(--ink-gray-7);    color: var(--surface-white); }
</style>
