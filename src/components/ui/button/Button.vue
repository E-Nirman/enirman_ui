<script setup>
import { Primitive } from 'reka-ui'
import { cva } from 'class-variance-authority'
import { cn } from '../../../lib/utils.js'

/*
 * Button — Enirman Design System materiality.
 *
 * Default treatment is "Soft": vertical gradient, navy-tinted layered
 * shadow, 1px white inner highlight, `translateY(1px)` on :active.
 * Refined and tactile, not glossy. The actual gradient + shadow
 * styles live as named classes in theme.css (`.eui-btn-soft-*`)
 * because Tailwind's JIT can't reliably parse arbitrary
 * `bg-[linear-gradient(...)]` values containing nested hsl()/var().
 *
 * Variants:
 *   default     — primary blue CTA (one per view max)
 *   secondary   — neutral white-on-gradient, gray border
 *   outline     — transparent with border; toolbars
 *   ghost       — chrome-less; dense toolbars, table rows
 *   subtle      — gray-100 fill; intermediate emphasis
 *   link        — inline text-style
 *   destructive — danger red, irreversible
 *   success     — affirmative final step
 *
 * Sizes:
 *   xs (24px) · sm (28px) · md (34px default) · lg (42px) · icon (square)
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
    'eui-btn',
    'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md',
    'font-medium tracking-tight flex-shrink-0 select-none',
    'transition-[transform,box-shadow,background-color,border-color,color] duration-fast ease-out-expo',
    'focus-visible:outline-none focus-visible:shadow-focus',
    'active:translate-y-px',
    'disabled:pointer-events-none disabled:opacity-45 disabled:active:translate-y-0',
  ],
  {
    variants: {
      variant: {
        default:     'eui-btn-soft-primary',
        secondary:   'eui-btn-soft-neutral',
        outline:     'border border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground',
        ghost:       'border-0 bg-transparent text-foreground hover:bg-muted',
        subtle:      'border-0 bg-muted text-foreground hover:bg-secondary',
        link:        'border-0 bg-transparent text-primary underline-offset-4 hover:underline active:translate-y-0',
        destructive: 'eui-btn-soft-destructive',
        success:     'eui-btn-soft-success',
      },
      size: {
        xs:        'eui-btn-h-xs px-2 text-2xs gap-1 [&_svg]:size-3',
        sm:        'eui-btn-h-sm px-2.5 text-xs [&_svg]:size-3.5',
        md:        'eui-btn-h-md px-3.5 text-sm [&_svg]:size-4',
        lg:        'eui-btn-h-lg px-5 text-base [&_svg]:size-[18px]',
        icon:      'eui-btn-h-md aspect-square px-0 [&_svg]:size-4',
        'icon-sm': 'eui-btn-h-sm aspect-square px-0 [&_svg]:size-3.5',
        'icon-lg': 'eui-btn-h-lg aspect-square px-0 [&_svg]:size-[18px]',
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
