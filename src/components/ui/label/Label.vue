<script setup>
import { Label as RekaLabel } from 'reka-ui'
import { cn } from '../../../lib/utils.js'

const props = defineProps({
  for:   { type: String, default: null },
  class: { type: [String, Array, Object], default: '' },
})
</script>

<template>
  <RekaLabel
    :for="props.for"
    :class="cn('text-xs font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70', props.class)"
  >
    <slot />
  </RekaLabel>
</template>
