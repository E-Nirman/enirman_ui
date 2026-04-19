<script setup>
import { Primitive } from 'reka-ui'
import { cva } from 'class-variance-authority'
import { cn } from '../../../lib/utils.js'

/*
 * Button — primary interactive control.
 *
 * Variants mirror shadcn-vue's API but our tokens drive the palette.
 * - default   : brand-filled CTA (one per view max)
 * - secondary : outlined button for default actions
 * - outline   : same as secondary but transparent; use in toolbars
 * - ghost     : no chrome until hover; dense toolbars
 * - link      : inline text-style
 * - destructive : irreversible operations (delete, remove, cancel)
 * - success   : affirmative final action in a multi-step flow
 *
 * Sizes: xs (24px), sm (28px), md (34px default), lg (40px), icon (square).
 * `asChild` renders as the slot root (for router-link / anchor wrapping).
 */

const props = defineProps({
  variant: { type: String, default: 'default' },
  size:    { type: String, default: 'md' },
  asChild: { type: Boolean, default: false },
  disabled:{ type: Boolean, default: false },
  as:      { type: [String, Object], default: 'button' },
  class:   { type: [String, Array, Object], default: '' },
})

const variants = cva(
  [
    'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md',
    'text-sm font-medium transition-colors flex-shrink-0',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        default:     'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
        secondary:   'bg-card text-foreground border border-border shadow-sm hover:bg-accent',
        outline:     'border border-border bg-transparent hover:bg-accent hover:text-accent-foreground',
        ghost:       'text-foreground hover:bg-accent hover:text-accent-foreground',
        subtle:      'bg-muted text-foreground hover:bg-muted/80',
        link:        'text-primary underline-offset-4 hover:underline',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        success:     'bg-success text-success-foreground shadow-sm hover:bg-success/90',
      },
      size: {
        xs:   'h-6 px-2 text-xs rounded [&_svg]:size-3',
        sm:   'h-7 px-2.5 text-xs [&_svg]:size-3.5',
        md:   'h-8.5 px-3.5 [&_svg]:size-4',
        lg:   'h-10 px-4.5 text-base [&_svg]:size-4',
        icon: 'size-8.5 [&_svg]:size-4',
        'icon-sm': 'size-7 [&_svg]:size-3.5',
        'icon-lg': 'size-10 [&_svg]:size-[18px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size:    'md',
    },
  },
)
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :disabled="disabled"
    :class="cn(variants({ variant, size }), props.class)"
  >
    <slot />
  </Primitive>
</template>

<style scoped>
/* Explicit 34px height since Tailwind doesn't ship h-8.5 */
:deep(.h-8\.5),
.h-8\.5 { height: 2.125rem; }
.size-8\.5 { height: 2.125rem; width: 2.125rem; }
</style>
