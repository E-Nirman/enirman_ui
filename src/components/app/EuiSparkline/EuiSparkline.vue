<script setup>
import { computed } from 'vue'
import { cn } from '../../../lib/utils.js'

/*
 * EuiSparkline — tiny line chart for KPI tiles and table cells.
 *
 * Default 60×18 SVG (matches the Pieces.jsx prototype). Stroke color
 * routes from semantic tone: positive uses success, negative uses
 * destructive, neutral uses muted-foreground.
 *
 * The path is computed from the points array; flat lines (max==min)
 * render at the vertical midpoint to avoid degenerate divide-by-zero.
 *
 * Props:
 *   points (number[])   — required, the values to plot
 *   tone   (positive|negative|neutral) — stroke color, default positive
 *   width / height (px) — defaults 60 / 18
 *   strokeWidth         — default 1.5
 *   fillBelow (boolean) — gradient fill under the line
 */

const props = defineProps({
  points:      { type: Array, required: true },
  tone:        { type: String, default: 'positive' },
  width:       { type: Number, default: 60 },
  height:      { type: Number, default: 18 },
  strokeWidth: { type: Number, default: 1.5 },
  fillBelow:   { type: Boolean, default: false },
  class:       { type: [String, Array, Object], default: '' },
})

const stroke = computed(() => {
  if (props.tone === 'negative') return 'hsl(var(--destructive))'
  if (props.tone === 'neutral')  return 'hsl(var(--muted-foreground))'
  return 'hsl(var(--success))'
})

const path = computed(() => {
  const pts = props.points
  if (!pts.length) return ''
  const max = Math.max(...pts)
  const min = Math.min(...pts)
  const span = max - min || 1
  const dx = pts.length === 1 ? 0 : props.width / (pts.length - 1)
  return pts.map((p, i) => {
    const x = i * dx
    const y = props.height - ((p - min) / span) * props.height
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
  }).join(' ')
})

const fillPath = computed(() => {
  if (!props.fillBelow || !path.value) return ''
  return `${path.value} L ${props.width} ${props.height} L 0 ${props.height} Z`
})

const gradientId = computed(() => `eui-spark-fill-${Math.random().toString(36).slice(2, 8)}`)
</script>

<template>
  <svg
    :class="cn('block', props.class)"
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    aria-hidden="true"
    role="presentation"
  >
    <defs v-if="fillBelow">
      <linearGradient :id="gradientId" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" :stop-color="stroke" stop-opacity="0.22" />
        <stop offset="100%" :stop-color="stroke" stop-opacity="0" />
      </linearGradient>
    </defs>
    <path v-if="fillBelow" :d="fillPath" :fill="`url(#${gradientId})`" />
    <path
      :d="path"
      fill="none"
      :stroke="stroke"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
