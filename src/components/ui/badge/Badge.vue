<script setup>
import { cva } from 'class-variance-authority'
import { cn } from '../../../lib/utils.js'

/*
 * Badge — status / category chip.
 *
 * Two shapes:
 *   pill (default) — 999px radius, status slot for indicators
 *   tag            — 4px radius, taxonomy / labels
 *
 * Variants encode meaning. The default soft style uses `*-muted` bg
 * with `*-ink` foreground; a leading 6px dot picks the saturated
 * `*` color so the chip reads at a glance even without text.
 *
 * `solid` flips to filled — louder, reserve for high-urgency states
 * (e.g. "Overdue", "Live"). `withDot=false` removes the dot for
 * label-only chips (taxonomy tags, categories).
 */

const props = defineProps({
  variant: { type: String, default: 'default' },
  shape:   { type: String, default: 'pill' },
  solid:   { type: Boolean, default: false },
  withDot: { type: Boolean, default: true },
  class:   { type: [String, Array, Object], default: '' },
})

const wrapper = cva(
  [
    'inline-flex items-center gap-1.5 px-2 py-0.5 text-2xs font-semibold whitespace-nowrap',
    'transition-colors duration-fast ease-out-expo',
  ],
  {
    variants: {
      shape: {
        pill: 'rounded-pill h-[22px]',
        tag:  'rounded-[var(--radius-xs)] h-[22px]',
      },
      variant: {
        default:     'bg-muted text-muted-foreground',
        primary:     'bg-info-muted text-info-ink',
        info:        'bg-info-muted text-info-ink',
        success:     'bg-success-muted text-success-ink',
        approved:    'bg-success-muted text-success-ink',
        warning:     'bg-warning-muted text-warning-ink',
        pending:     'bg-warning-muted text-warning-ink',
        destructive: 'bg-destructive-muted text-destructive-ink',
        overdue:     'bg-destructive-muted text-destructive-ink',
        plus:        'bg-plus-muted text-plus-ink',
        outline:     'border border-border text-foreground',
        draft:       'bg-muted text-foreground',
      },
      solid: {
        true:  '',
        false: '',
      },
    },
    compoundVariants: [
      { variant: 'primary',     solid: true, class: 'bg-primary text-primary-foreground' },
      { variant: 'info',        solid: true, class: 'bg-info text-info-foreground' },
      { variant: 'success',     solid: true, class: 'bg-success text-success-foreground' },
      { variant: 'approved',    solid: true, class: 'bg-success text-success-foreground' },
      { variant: 'warning',     solid: true, class: 'bg-warning text-warning-foreground' },
      { variant: 'pending',     solid: true, class: 'bg-warning text-warning-foreground' },
      { variant: 'destructive', solid: true, class: 'bg-destructive text-destructive-foreground' },
      { variant: 'overdue',     solid: true, class: 'bg-destructive text-destructive-foreground' },
      { variant: 'plus',        solid: true, class: 'bg-plus text-plus-foreground' },
    ],
    defaultVariants: {
      variant: 'default',
      shape:   'pill',
      solid:   false,
    },
  },
)

const dot = cva('h-1.5 w-1.5 rounded-full flex-shrink-0', {
  variants: {
    variant: {
      default:     'bg-muted-foreground',
      primary:     'bg-primary',
      info:        'bg-info',
      success:     'bg-success',
      approved:    'bg-success',
      warning:     'bg-warning',
      pending:     'bg-warning',
      destructive: 'bg-destructive',
      overdue:     'bg-destructive',
      plus:        'bg-plus',
      outline:     'bg-foreground',
      draft:       'bg-muted-foreground',
    },
  },
  defaultVariants: { variant: 'default' },
})
</script>

<template>
  <span :class="cn(wrapper({ variant, shape, solid }), props.class)">
    <span v-if="withDot && shape === 'pill' && !solid" :class="dot({ variant })" />
    <slot />
  </span>
</template>
