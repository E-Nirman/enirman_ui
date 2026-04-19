<script setup>
import { TabsList as RekaTabsList } from 'reka-ui'
import { cva } from 'class-variance-authority'
import { cn } from '../../../lib/utils.js'

const props = defineProps({
  variant: { type: String, default: 'underline' },
  class:   { type: [String, Array, Object], default: '' },
})

const variants = cva('inline-flex items-center', {
  variants: {
    variant: {
      pills:     'h-9 rounded-md bg-muted p-1 text-muted-foreground gap-1',
      underline: 'gap-0.5 border-b border-border w-full',
      segmented: 'rounded-md border border-border bg-card p-0.5 gap-0.5 text-muted-foreground',
    },
  },
  defaultVariants: { variant: 'underline' },
})
</script>

<template>
  <RekaTabsList :class="cn(variants({ variant }), props.class)">
    <slot />
  </RekaTabsList>
</template>
