<script setup>
import { ScrollAreaRoot, ScrollAreaViewport, ScrollAreaCorner } from 'reka-ui'
import ScrollBar from './ScrollBar.vue'
import { cn } from '../../../lib/utils.js'

const props = defineProps({
  class:   { type: [String, Array, Object], default: '' },
  type:    { type: String, default: 'hover' },
})
</script>

<template>
  <ScrollAreaRoot :class="cn('relative overflow-hidden', props.class)" :type="type">
    <ScrollAreaViewport class="h-full w-full rounded-[inherit]">
      <slot />
    </ScrollAreaViewport>
    <ScrollBar />
    <ScrollAreaCorner />
  </ScrollAreaRoot>
</template>
