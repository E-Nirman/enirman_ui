<script setup>
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils.js'

/*
 * EmptyState — blank slate / no-results view.
 *
 * Use for:
 *   - First-time user ("No projects yet") → tone="primary"
 *   - Filter returned nothing ("No matches") → tone="default"
 *   - Something went wrong ("Failed to load") → tone="destructive"
 *   - Paywalled feature → tone="plus"
 */

const props = defineProps({
  icon:        { type: [Object, Function], default: null },
  title:       { type: String, default: '' },
  description: { type: String, default: '' },
  tone:        { type: String, default: 'default' },
  compact:     { type: Boolean, default: false },
  bordered:    { type: Boolean, default: false },
  class:       { type: [String, Array, Object], default: '' },
})

const iconWrap = cva(
  'flex size-10 items-center justify-center rounded-lg',
  {
    variants: {
      tone: {
        default:     'bg-muted text-muted-foreground',
        primary:     'bg-primary/10 text-primary',
        success:     'bg-success-muted text-success-ink',
        warning:     'bg-warning-muted text-warning-ink',
        destructive: 'bg-destructive/10 text-destructive',
        plus:        'bg-plus-muted text-plus-ink',
      },
    },
    defaultVariants: { tone: 'default' },
  },
)
</script>

<template>
  <div :class="cn(
    'flex flex-col items-center justify-center text-center gap-2',
    compact ? 'py-8 px-4' : 'py-14 px-6',
    bordered ? 'rounded-lg border border-dashed border-border bg-muted/30' : '',
    props.class,
  )">
    <div v-if="icon" :class="iconWrap({ tone })">
      <component :is="icon" class="size-5" />
    </div>
    <h3 v-if="title" class="text-sm font-semibold text-foreground mt-1">{{ title }}</h3>
    <p v-if="description" class="text-xs text-muted-foreground max-w-[360px] leading-relaxed">{{ description }}</p>
    <div v-if="$slots.action" class="mt-2 flex flex-wrap justify-center gap-2">
      <slot name="action" />
    </div>
  </div>
</template>
