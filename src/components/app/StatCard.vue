<script setup>
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils.js'
import { ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-vue-next'
import { EuiSparkline } from './EuiSparkline/index.js'

/*
 * StatCard — KPI tile for dashboards.
 *
 * Layout per the Enirman web-app Shell:
 *   [eyebrow label]  ........  [icon, optional]
 *   [big display value]
 *   [Δdelta chip] [optional sparkline] [description]
 *
 * Display values use the sans display face (Manrope 700 / 28px),
 * NOT the mono — mono is reserved for IDs, dates, and dense table
 * numerics. The sparkline tone follows the delta sign by default.
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
  spark:       { type: Array, default: null },
  to:          { type: [String, Object], default: null },
  href:        { type: String, default: null },
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
const sparkTone = computed(() => {
  if (props.delta === null || props.delta === undefined) return 'positive'
  return deltaPositive.value ? 'positive' : 'negative'
})
</script>

<template>
  <component
    :is="tag"
    :to="to"
    :href="href"
    :class="cn(
      'group relative flex flex-col gap-3 rounded-lg border border-border-subtle bg-card p-4 shadow-sm transition-all duration-fast ease-out-expo',
      (to || href) && 'cursor-pointer hover:border-ring/40 hover:shadow-md',
      props.class,
    )"
  >
    <!-- Top row: label + icon -->
    <div class="flex items-start justify-between gap-2">
      <p class="text-xs font-medium uppercase tracking-caps text-muted-foreground">{{ label }}</p>
      <span v-if="icon" :class="iconWrap({ tone })">
        <component :is="icon" class="size-4" />
      </span>
    </div>

    <!-- Value (display sans, not mono) -->
    <p class="font-display text-[28px] font-bold leading-none tracking-tight text-foreground">
      {{ value }}
    </p>

    <!-- Footer: delta + sparkline + description -->
    <div v-if="description || delta !== null || spark" class="flex items-center gap-2 text-xs text-muted-foreground">
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
      <EuiSparkline v-if="spark && spark.length" :points="spark" :tone="sparkTone" />
      <span v-if="description" class="truncate">{{ description }}</span>
    </div>

    <!-- Link chevron (only when interactive) -->
    <ArrowUpRight
      v-if="to || href"
      class="absolute right-3 top-3 size-3.5 text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100"
    />
  </component>
</template>
