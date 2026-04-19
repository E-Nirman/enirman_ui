<script setup>
import { TooltipContent, TooltipPortal } from 'reka-ui'
import { cn } from '../../../lib/utils.js'

const props = defineProps({
  sideOffset: { type: Number, default: 6 },
  side:       { type: String, default: 'top' },
  align:      { type: String, default: 'center' },
  class:      { type: [String, Array, Object], default: '' },
})
</script>

<template>
  <TooltipPortal>
    <TooltipContent
      :side-offset="sideOffset"
      :side="side"
      :align="align"
      :class="cn(
        'z-50 overflow-hidden rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-md',
        'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        'data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1',
        'data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1',
        props.class,
      )"
    >
      <slot />
    </TooltipContent>
  </TooltipPortal>
</template>
