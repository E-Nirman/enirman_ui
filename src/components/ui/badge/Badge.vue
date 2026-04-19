<script setup>
import { cva } from 'class-variance-authority'
import { cn } from '../../../lib/utils.js'

/*
 * Badge — status / category chip.
 *
 * Variants encode meaning (success, warning, info, etc.); default uses
 * neutral muted. `solid` prop flips from tinted to filled for louder
 * states (e.g. "Overdue", "Active") — reserve for real-world urgency.
 */

const props = defineProps({
  variant: { type: String, default: 'default' },
  solid:   { type: Boolean, default: false },
  class:   { type: [String, Array, Object], default: '' },
})

const variants = cva(
  'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition-colors whitespace-nowrap',
  {
    variants: {
      variant: {
        default:     'bg-muted text-muted-foreground',
        primary:     'bg-primary/10 text-primary',
        success:     'bg-success-muted text-success-ink',
        warning:     'bg-warning-muted text-warning-ink',
        info:        'bg-info-muted text-info-ink',
        destructive: 'bg-destructive/10 text-destructive',
        plus:        'bg-plus-muted text-plus-ink',
        outline:     'border border-border text-foreground',
      },
      solid: {
        true:  '',
        false: '',
      },
    },
    compoundVariants: [
      { variant: 'primary',     solid: true, class: 'bg-primary text-primary-foreground' },
      { variant: 'success',     solid: true, class: 'bg-success text-success-foreground' },
      { variant: 'warning',     solid: true, class: 'bg-warning text-warning-foreground' },
      { variant: 'info',        solid: true, class: 'bg-info text-info-foreground' },
      { variant: 'destructive', solid: true, class: 'bg-destructive text-destructive-foreground' },
      { variant: 'plus',        solid: true, class: 'bg-plus text-plus-foreground' },
    ],
    defaultVariants: {
      variant: 'default',
      solid:   false,
    },
  },
)
</script>

<template>
  <span :class="cn(variants({ variant, solid }), props.class)">
    <slot />
  </span>
</template>
