<script setup>
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '../../../lib/utils.js'

/*
 * Spinner — circular indeterminate loader.
 *
 * Drop-in replacement for frappe-ui's LoadingIndicator. SVG-based so it
 * sizes via Tailwind size utilities and inherits `currentColor` for
 * tone. Pair with text via `<Spinner /> Loading…` or wrap inside a
 * Button slot for "loading" affordance.
 *
 * Props:
 *   size  — 'xs' (12px) · 'sm' (16px) · 'md' (20px, default) · 'lg' (28px)
 *   tone  — 'default' (currentColor, default) | 'primary' | 'muted'
 */

const props = defineProps({
  size:  { type: String, default: 'md' },
  tone:  { type: String, default: 'default' },
  class: { type: [String, Array, Object], default: '' },
})

const root = cva('inline-block animate-spin', {
  variants: {
    size: {
      xs: 'size-3',
      sm: 'size-4',
      md: 'size-5',
      lg: 'size-7',
    },
    tone: {
      default: 'text-current',
      primary: 'text-primary',
      muted:   'text-muted-foreground',
    },
  },
  defaultVariants: { size: 'md', tone: 'default' },
})
</script>

<template>
  <svg
    :class="cn(root({ size, tone }), props.class)"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    role="presentation"
  >
    <circle
      class="opacity-20"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="3"
    />
    <path
      class="opacity-90"
      fill="currentColor"
      d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
</template>
