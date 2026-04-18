<template>
  <div class="eui-progress" :class="[`eui-progress--${size}`]" role="progressbar" :aria-valuenow="clamped" aria-valuemin="0" aria-valuemax="100">
    <div class="eui-progress__track">
      <div class="eui-progress__fill" :class="[`eui-progress__fill--${tone}`, { 'eui-progress__fill--indeterminate': indeterminate }]" :style="{ width: indeterminate ? '30%' : `${clamped}%` }" />
    </div>
    <span v-if="showLabel" class="eui-progress__label">{{ clamped }}%</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

/*
 * EuiProgressBar — determinate or indeterminate progress.
 *
 * Tones: brand (default), success, warning, danger, accent
 * Sizes: xs (3px), sm (5px), md (8px)
 */
const props = defineProps({
  value:   { type: Number, default: 0 },
  tone:    { type: String, default: 'brand' },
  size:    { type: String, default: 'sm' },
  showLabel: { type: Boolean, default: false },
  indeterminate: { type: Boolean, default: false },
})

const clamped = computed(() => Math.max(0, Math.min(100, Math.round(props.value))))
</script>

<style scoped>
.eui-progress { display: flex; align-items: center; gap: 8px; width: 100%; }
.eui-progress__track {
  flex: 1;
  background: var(--surface-gray-2);
  border-radius: var(--radius-full);
  overflow: hidden;
}
.eui-progress--xs .eui-progress__track { height: 3px; }
.eui-progress--sm .eui-progress__track { height: 5px; }
.eui-progress--md .eui-progress__track { height: 8px; }

.eui-progress__fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width .3s ease-out;
}
.eui-progress__fill--brand   { background: var(--color-primary); }
.eui-progress__fill--success { background: var(--color-success); }
.eui-progress__fill--warning { background: var(--color-warning); }
.eui-progress__fill--danger  { background: var(--color-danger); }
.eui-progress__fill--accent  { background: var(--color-accent); }

.eui-progress__fill--indeterminate {
  animation: eui-indet 1.4s ease-in-out infinite;
}
@keyframes eui-indet {
  0%   { margin-left: -30%; }
  100% { margin-left: 100%; }
}

.eui-progress__label {
  font-size: 12px;
  font-weight: 500;
  color: var(--ink-gray-6);
  min-width: 36px;
  text-align: right;
}
</style>
