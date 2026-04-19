<script setup>
import { AvatarRoot } from 'reka-ui'
import { cva } from 'class-variance-authority'
import { cn } from '../../../lib/utils.js'

const props = defineProps({
  size:  { type: String, default: 'md' },
  class: { type: [String, Array, Object], default: '' },
})

const variants = cva(
  'relative inline-flex shrink-0 overflow-hidden rounded-full bg-muted',
  {
    variants: {
      size: {
        xs:  'size-5 text-[10px]',
        sm:  'size-7 text-xs',
        md:  'size-8 text-sm',
        lg:  'size-10 text-base',
        xl:  'size-14 text-lg',
      },
    },
    defaultVariants: { size: 'md' },
  },
)
</script>

<template>
  <AvatarRoot :class="cn(variants({ size }), props.class)">
    <slot />
  </AvatarRoot>
</template>
