<script setup>
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils.js'
import { ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-vue-next'

/*
 * StatCard — clean, compact metric tile.
 *
 * Design moves away from the v1 colored-stripe look toward a Linear-
 * style minimal card: muted label, large tabular value, optional delta
 * chip, and a small icon tile in the corner. Click-through is opt-in
 * via `to` / `href`.
 *
 * Props:
 *   label, value (string or number), description, icon (lucide)
 *   tone:   default | primary | success | warning | destructive | plus
 *   delta:  signed number; auto-colors positive green / negative red
 *   deltaSuffix: default '%'; pass '' for counts
 *   to / href: makes the card a link
 */

const props = defineProps({
  label:       { type: String, required: true },
  value:       { type: [String, Number], required: true },
  description: { type: String, default: '' },
  icon:        { type: [Object, Function], default: null },
  tone:        { type: String, default: 'default' },
  delta:       { type: Number, default: null },
  deltaSuffix: { type: String, default: '%' },
  to:          { type: [String, Object], default: null },
  href:        { type: String, default: null },
  class:       { type: [String, Array, Object], default: '' },
})

const tag = computed(() => (props.to ? 'router-link' : props.href ? 'a' : 'div'))

const iconWrap = cva(
  'flex size-8 items-center justify-center rounded-md',
  {
    variants: {
      tone: {
        default:     'bg-muted text-muted-foreground',
        primary:     'bg-primary/10 text-primary',
        success:     'bg-success-muted text-success-ink',
        warning:     'bg-warning-muted text-warning-ink',
        destructive: 'bg-destructive/10 text-destructive',
        info:        'bg-info-muted text-info-ink',
        plus:        'bg-plus-muted text-plus-ink',
      },
    },
    defaultVariants: { tone: 'default' },
  },
)

const deltaPositive = computed(() => (props.delta ?? 0) >= 0)
</script>

<template>
  <component
    :is="tag"
    :to="to"
    :href="href"
    :class="cn(
      'group relative flex flex-col gap-3 rounded-lg border border-border bg-card p-4 transition-all',
      (to || href) && 'cursor-pointer hover:border-ring/40 hover:shadow-md',
      props.class,
    )"
  >
    <!-- Top row: label + icon -->
    <div class="flex items-start justify-between gap-2">
      <p class="text-xs font-medium text-muted-foreground">{{ label }}</p>
      <span v-if="icon" :class="iconWrap({ tone })">
        <component :is="icon" class="size-4" />
      </span>
    </div>

    <!-- Value -->
    <p class="font-mono text-[26px] font-semibold leading-none tracking-tight text-foreground tabular-nums">
      {{ value }}
    </p>

    <!-- Footer: delta + description -->
    <div v-if="description || delta !== null" class="flex items-center gap-2 text-xs text-muted-foreground">
      <span
        v-if="delta !== null && delta !== undefined"
        :class="cn(
          'inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 font-medium tabular-nums',
          deltaPositive ? 'bg-success-muted text-success-ink' : 'bg-destructive/10 text-destructive',
        )"
      >
        <TrendingUp v-if="deltaPositive" class="size-3" />
        <TrendingDown v-else class="size-3" />
        {{ Math.abs(delta) }}{{ deltaSuffix }}
      </span>
      <span v-if="description" class="truncate">{{ description }}</span>
    </div>

    <!-- Link chevron (only when interactive) -->
    <ArrowUpRight
      v-if="to || href"
      class="absolute right-3 top-3 size-3.5 text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100"
    />
  </component>
</template>
