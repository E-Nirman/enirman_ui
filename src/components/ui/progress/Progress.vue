<script setup>
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../../../lib/utils.js'

/*
 * Progress — horizontal completion bar.
 *
 * Used inline in tables (project progress) and standalone in mobile
 * stat tiles. Tone routes the fill color so a "behind schedule" bar
 * reads as warning / danger without inline styles.
 *
 * Props:
 *   value (0-100) — required percentage
 *   tone (default | success | warning | destructive | info)
 *   size (sm | md)  — 4px / 6px tall
 *   showValue (boolean) — render "{value}%" on the right
 *   srLabel — accessible label (defaults "Progress")
 */

const props = defineProps({
  value:     { type: Number, required: true },
  tone:      { type: String, default: 'default' },
  size:      { type: String, default: 'sm' },
  showValue: { type: Boolean, default: false },
  srLabel:   { type: String, default: 'Progress' },
  class:     { type: [String, Array, Object], default: '' },
})

const clamped = computed(() => Math.max(0, Math.min(100, props.value)))

const trackHeight = computed(() => (props.size === 'md' ? 'h-1.5' : 'h-1'))

const fillVariants = cva('h-full rounded-pill transition-[width] duration-base ease-out-expo', {
  variants: {
    tone: {
      default:     'bg-primary',
      info:        'bg-info',
      success:     'bg-success',
      warning:     'bg-warning',
      destructive: 'bg-destructive',
    },
  },
  defaultVariants: { tone: 'default' },
})
</script>

<template>
  <div :class="cn('flex items-center gap-2', props.class)">
    <div
      role="progressbar"
      :aria-label="srLabel"
      :aria-valuenow="clamped"
      aria-valuemin="0"
      aria-valuemax="100"
      :class="cn('flex-1 overflow-hidden rounded-pill bg-muted', trackHeight)"
    >
      <div :class="fillVariants({ tone })" :style="{ width: `${clamped}%` }" />
    </div>
    <span
      v-if="showValue"
      class="font-mono text-2xs font-medium text-muted-foreground tabular-nums"
    >{{ clamped }}%</span>
  </div>
</template>
