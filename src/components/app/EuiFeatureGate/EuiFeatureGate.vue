<script setup>
import { Sparkles, ArrowUpRight } from 'lucide-vue-next'
import { cva } from 'class-variance-authority'
import { cn } from '../../../lib/utils.js'

/*
 * EuiFeatureGate — "this is gated, here's the upgrade pitch" wrapper.
 *
 * Renders the slot when `unlocked` is true, otherwise renders an
 * empty-state-style upgrade card with icon, title, description, and
 * a CTA. Tone routes the icon background and CTA color (info / warning
 * / success / plus) so plan-tier callers (Plus / Lite / Pro) keep
 * their distinct visual identity.
 *
 * The composable that decides `unlocked` (e.g. session.isPlus) lives
 * in the consumer app. This component is purely presentational.
 *
 * Props:
 *   unlocked      — boolean, when true renders <slot/>
 *   tone          — 'info' (default) | 'warning' | 'success' | 'plus'
 *   title         — top-line copy (default "This feature")
 *   description   — body copy
 *   ctaLabel      — button label (default "Upgrade Plan")
 *   ctaHref       — link target (defaults to "/app/engineering-firm")
 *   icon          — optional override icon component (default Sparkles)
 */

const props = defineProps({
  unlocked:    { type: Boolean, default: false },
  tone:        { type: String,  default: 'info' },
  title:       { type: String,  default: 'This feature' },
  description: { type: String,  default: 'Upgrade your plan to unlock this feature.' },
  ctaLabel:    { type: String,  default: 'Upgrade Plan' },
  ctaHref:     { type: String,  default: '/app/engineering-firm' },
  icon:        { type: [Object, Function], default: null },
  class:       { type: [String, Array, Object], default: '' },
})

const iconWrap = cva('mb-4 flex h-12 w-12 items-center justify-center rounded-xl', {
  variants: {
    tone: {
      info:    'bg-info-muted text-info',
      warning: 'bg-warning-muted text-warning',
      success: 'bg-success-muted text-success',
      plus:    'bg-plus-muted text-plus',
    },
  },
  defaultVariants: { tone: 'info' },
})

const cta = cva('eui-btn eui-btn-h-md mt-5 inline-flex items-center justify-center gap-1.5 px-4 rounded-md text-sm font-medium text-white transition-[transform,box-shadow,background-color] duration-fast ease-out-expo active:translate-y-px shadow-soft hover:shadow-soft-hover', {
  variants: {
    tone: {
      info:    'eui-btn-soft-primary',
      warning: 'eui-btn-soft-destructive',
      success: 'eui-btn-soft-success',
      plus:    'eui-btn-soft-destructive',
    },
  },
  defaultVariants: { tone: 'info' },
})
</script>

<template>
  <slot v-if="unlocked" />

  <div
    v-else
    :class="cn('flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 px-8 py-12 text-center', props.class)"
  >
    <div :class="iconWrap({ tone })">
      <component :is="icon || Sparkles" class="size-6" />
    </div>
    <p class="text-base font-semibold text-foreground">{{ title }}</p>
    <p class="mt-1.5 max-w-sm text-sm text-muted-foreground">{{ description }}</p>
    <a :href="ctaHref" :class="cta({ tone })">
      <ArrowUpRight class="size-4" />
      {{ ctaLabel }}
    </a>
  </div>
</template>
