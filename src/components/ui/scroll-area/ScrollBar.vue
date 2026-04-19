<script setup>
import { ScrollAreaScrollbar, ScrollAreaThumb } from 'reka-ui'
import { cn } from '../../../lib/utils.js'

const props = defineProps({
  orientation: { type: String, default: 'vertical' },
  class: { type: [String, Array, Object], default: '' },
})
</script>

<template>
  <ScrollAreaScrollbar
    :orientation="orientation"
    :class="cn(
      'flex touch-none select-none transition-colors',
      orientation === 'vertical'   ? 'h-full w-2.5 border-l border-l-transparent p-0.5' : '',
      orientation === 'horizontal' ? 'h-2.5 flex-col border-t border-t-transparent p-0.5' : '',
      props.class,
    )"
  >
    <ScrollAreaThumb class="relative flex-1 rounded-full bg-border hover:bg-muted-foreground/40 transition-colors" />
  </ScrollAreaScrollbar>
</template>
