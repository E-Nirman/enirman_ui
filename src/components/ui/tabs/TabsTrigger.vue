<script setup>
import { TabsTrigger as RekaTabsTrigger } from 'reka-ui'
import { cva } from 'class-variance-authority'
import { cn } from '../../../lib/utils.js'

const props = defineProps({
  value:   { type: [String, Number], required: true },
  variant: { type: String, default: 'underline' },
  disabled:{ type: Boolean, default: false },
  class:   { type: [String, Array, Object], default: '' },
})

const variants = cva(
  [
    'inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-sm font-medium transition-all',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    'disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-3.5',
  ],
  {
    variants: {
      variant: {
        pills:     'rounded-sm px-3 py-1 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        underline: 'relative px-3 py-2.5 -mb-px border-b-2 border-transparent text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground',
        segmented: 'rounded-[0.375rem] px-3 py-1 data-[state=active]:bg-accent data-[state=active]:text-foreground',
      },
    },
    defaultVariants: { variant: 'underline' },
  },
)
</script>

<template>
  <RekaTabsTrigger :value="value" :disabled="disabled" :class="cn(variants({ variant }), props.class)">
    <slot />
  </RekaTabsTrigger>
</template>
