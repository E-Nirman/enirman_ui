<script setup>
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils.js'
import { ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-vue-next'

/*
 * StatCard — KPI tile for dashboards.
 *
 * Layout per the Enirman web-app Shell:
 *   [eyebrow label]  ........  [icon, optional]
 *   [big display value]
 *   [Δdelta chip] [description]
 *
 * Display values use the sans display face (Manrope 700 / 28px),
 * NOT the mono — mono is reserved for IDs, dates, and dense table
 * numerics.
 *
 * Click-through is opt-in via `to` / `href`.
 */

const props = defineProps({
  label:       { type: String, required: true },
  value:       { type: [String, Number], required: true },
  description: { type: String, default: '' },
  icon:        { type: [Object, Function], default: null },
  tone:        { type: String, default: 'default' },
  delta:       { type: Number, default: null },
  deltaSuffix: { type: String, default: '%' },
  descriptionTone: { type: String, default: 'neutral' }, // 'success'|'warning'|'destructive'|'neutral'
  to:          { type: [String, Object], default: null },
  href:        { type: String, default: null },
  showArrow:   { type: Boolean, default: false },
  class:       { type: [String, Array, Object], default: '' },
})

const tag = computed(() => (props.to ? 'router-link' : props.href ? 'a' : 'div'))

const iconWrap = cva(
  'flex size-8 items-center justify-center rounded-md flex-shrink-0',
  {
    variants: {
      tone: {
        default:     'bg-muted text-muted-foreground',
        primary:     'bg-info-muted text-info-ink',
        success:     'bg-success-muted text-success-ink',
        warning:     'bg-warning-muted text-warning-ink',
        destructive: 'bg-destructive-muted text-destructive-ink',
        info:        'bg-info-muted text-info-ink',
        plus:        'bg-plus-muted text-plus-ink',
      },
    },
    defaultVariants: { tone: 'default' },
  },
)

const deltaPositive = computed(() => (props.delta ?? 0) >= 0)

// mockup stat tiles: caption carries the tone ("+2 this month" success,
// "3 overdue" warning/amber, hard failure states destructive); neutral
// stays muted. warning added for S-21 ("N overdue" sub-line — amber, not
// red: overdue-but-recoverable reads as a warning tone in this system,
// destructive is reserved for hard failure states).
const DESCRIPTION_TONE = {
  success:     'text-success-ink font-semibold',
  warning:     'text-warning-ink font-semibold',
  destructive: 'text-destructive-ink font-semibold',
  neutral:     '',
}
const descriptionClass = computed(() => DESCRIPTION_TONE[props.descriptionTone] || '')
</script>

<template>
  <component
    :is="tag"
    :to="to"
    :href="href"
    :class="cn(
      'group relative flex flex-col gap-1 rounded-[10px] border border-border-subtle bg-card px-4 py-3.5 shadow-sm transition-all duration-fast ease-out-expo',
      (to || href) && 'cursor-pointer hover:border-ring/40 hover:shadow-md',
      props.class,
    )"
  >
    <!-- Top row: label + icon -->
    <div class="flex items-start justify-between gap-2">
      <!-- mockup .stat-tile .label: sentence case, 12px/500 muted -->
      <p class="text-xs font-medium text-muted-foreground">{{ label }}</p>
      <span v-if="icon" :class="iconWrap({ tone })">
        <component :is="icon" class="size-4" />
      </span>
    </div>

    <!-- Value (display sans, not mono; 26px per the v4 mockup tiles) -->
    <p class="font-display text-[26px] font-bold leading-none tracking-tight text-foreground tabular-nums">
      {{ value }}
    </p>

    <!-- Footer: delta + description -->
    <div v-if="description || delta !== null" class="mt-0.5 flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
      <span
        v-if="delta !== null && delta !== undefined"
        :class="cn(
          'inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 font-semibold tabular-nums',
          deltaPositive ? 'bg-success-muted text-success-ink' : 'bg-destructive-muted text-destructive-ink',
        )"
      >
        <TrendingUp v-if="deltaPositive" class="size-3" />
        <TrendingDown v-else class="size-3" />
        {{ Math.abs(delta) }}{{ deltaSuffix }}
      </span>
      <span v-if="description" class="truncate" :class="descriptionClass">{{ description }}</span>
    </div>

    <!-- Link chevron (only when interactive) -->
    <ArrowUpRight
      v-if="showArrow && (to || href)"
      class="absolute right-3 top-3 size-3.5 text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100"
    />
  </component>
</template>
