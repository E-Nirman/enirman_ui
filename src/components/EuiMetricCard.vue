<template>
  <component :is="tag" class="eui-metric" :class="[`eui-metric--${tone}`, { 'eui-metric--interactive': to || href }]" :to="to" :href="href">
    <span class="eui-metric__stripe" aria-hidden="true" />
    <div class="eui-metric__top">
      <span class="eui-metric__label">{{ label }}</span>
      <span v-if="icon" class="eui-metric__icon-wrap">
        <component :is="icon" class="eui-metric__icon" aria-hidden="true" />
      </span>
    </div>
    <div class="eui-metric__value">{{ value }}</div>
    <div v-if="subtitle || delta" class="eui-metric__foot">
      <span v-if="delta !== null && delta !== undefined" class="eui-metric__delta" :class="{ 'eui-metric__delta--pos': deltaPositive, 'eui-metric__delta--neg': !deltaPositive }">
        {{ deltaPositive ? '▲' : '▼' }} {{ Math.abs(delta) }}{{ deltaSuffix }}
      </span>
      <span v-if="subtitle" class="eui-metric__subtitle">{{ subtitle }}</span>
    </div>
  </component>
</template>

<script setup>
import { computed } from 'vue'

/*
 * EuiMetricCard — hero stat tile for dashboards.
 *
 * Tones paint the left-stripe and icon background: brand, success, warning,
 * danger, info, accent, gray.
 *
 * Set `delta` to show a trend badge (e.g. +12%) with positive/negative color.
 */

const props = defineProps({
  label:    { type: String, required: true },
  value:    { type: [String, Number], required: true },
  subtitle: { type: String, default: '' },
  icon:     { type: [Object, Function], default: null },
  tone:     { type: String, default: 'brand' },
  to:       { type: [String, Object], default: null },
  href:     { type: String, default: null },
  delta:    { type: Number, default: null },
  deltaSuffix: { type: String, default: '%' },
})

const tag = computed(() => (props.to ? 'router-link' : props.href ? 'a' : 'div'))
const deltaPositive = computed(() => (props.delta ?? 0) >= 0)
</script>

<style scoped>
.eui-metric {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 18px 16px 22px;
  background: var(--surface-white);
  border: 1px solid var(--surface-gray-3);
  border-radius: var(--radius-xl);
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  transition: border-color .15s, box-shadow .15s, transform .15s;
  min-height: 108px;
}
[data-theme="dark"] .eui-metric { background: var(--surface-cards); }

.eui-metric--interactive { cursor: pointer; }
.eui-metric--interactive:hover { border-color: var(--outline-gray-4, var(--surface-gray-4)); box-shadow: var(--shadow-md); }

.eui-metric__stripe {
  position: absolute;
  top: 0; left: 0; bottom: 0;
  width: 4px;
}
.eui-metric--brand   .eui-metric__stripe { background: var(--color-primary); }
.eui-metric--success .eui-metric__stripe { background: var(--color-success); }
.eui-metric--warning .eui-metric__stripe { background: var(--color-warning); }
.eui-metric--danger  .eui-metric__stripe { background: var(--color-danger); }
.eui-metric--info    .eui-metric__stripe { background: var(--color-info); }
.eui-metric--accent  .eui-metric__stripe { background: var(--color-accent); }
.eui-metric--gray    .eui-metric__stripe { background: var(--ink-gray-4); }

.eui-metric__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.eui-metric__label {
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-gray-6);
}
.eui-metric__icon-wrap {
  width: 32px; height: 32px;
  border-radius: var(--radius-lg);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.eui-metric--brand   .eui-metric__icon-wrap { background: var(--color-primary-subtle); color: var(--color-primary-ink); }
.eui-metric--success .eui-metric__icon-wrap { background: var(--color-success-subtle); color: var(--color-success-ink); }
.eui-metric--warning .eui-metric__icon-wrap { background: var(--color-warning-subtle); color: var(--color-warning-ink); }
.eui-metric--danger  .eui-metric__icon-wrap { background: var(--color-danger-subtle);  color: var(--color-danger-ink); }
.eui-metric--info    .eui-metric__icon-wrap { background: var(--color-info-subtle);    color: var(--color-info-ink); }
.eui-metric--accent  .eui-metric__icon-wrap { background: var(--color-accent-subtle);  color: var(--color-accent-ink); }
.eui-metric--gray    .eui-metric__icon-wrap { background: var(--surface-gray-2);       color: var(--ink-gray-6); }
.eui-metric__icon { width: 18px; height: 18px; }

.eui-metric__value {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ink-gray-9);
  line-height: 1.1;
  word-break: break-all;
}

.eui-metric__foot {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}
.eui-metric__subtitle { color: var(--ink-gray-5); }
.eui-metric__delta {
  font-weight: 600;
  padding: 2px 6px;
  border-radius: var(--radius-full);
}
.eui-metric__delta--pos { background: var(--color-success-subtle); color: var(--color-success-ink); }
.eui-metric__delta--neg { background: var(--color-danger-subtle);  color: var(--color-danger-ink); }
</style>
