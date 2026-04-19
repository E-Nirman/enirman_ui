<script setup>
import { Separator as RekaSeparator } from 'reka-ui'
import { cn } from '../../../lib/utils.js'

const props = defineProps({
  orientation: { type: String, default: 'horizontal' },
  decorative:  { type: Boolean, default: true },
  class:       { type: [String, Array, Object], default: '' },
})
</script>

<template>
  <RekaSeparator
    :orientation="orientation"
    :decorative="decorative"
    :class="cn(
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
      props.class,
    )"
  />
</template>
