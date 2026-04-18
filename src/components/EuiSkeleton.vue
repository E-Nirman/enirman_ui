<template>
  <div class="eui-skeleton" :class="[`eui-skeleton--${shape}`, { 'eui-skeleton--block': block }]" :style="style" />
</template>

<script setup>
import { computed } from 'vue'

/*
 * EuiSkeleton — shimmering placeholder for loading states.
 *
 * Shapes: line (default), circle, rect
 * Pass `width` and `height` in any CSS unit (default 100%/1em)
 */

const props = defineProps({
  shape:  { type: String, default: 'line' },
  width:  { type: String, default: '' },
  height: { type: String, default: '' },
  block:  { type: Boolean, default: false },
})

const style = computed(() => {
  const s = {}
  if (props.width) s.width = props.width
  if (props.height) s.height = props.height
  return s
})
</script>

<style scoped>
.eui-skeleton {
  display: inline-block;
  background:
    linear-gradient(90deg,
      var(--surface-gray-2) 0%,
      var(--surface-gray-3) 50%,
      var(--surface-gray-2) 100%);
  background-size: 200% 100%;
  animation: eui-shimmer 1.4s ease-in-out infinite;
  border-radius: var(--radius-sm);
}
.eui-skeleton--line   { height: 1em; width: 100%; }
.eui-skeleton--circle { border-radius: 50%; width: 2rem; height: 2rem; }
.eui-skeleton--rect   { border-radius: var(--radius-md); width: 100%; height: 2rem; }
.eui-skeleton--block  { display: block; }

@keyframes eui-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
