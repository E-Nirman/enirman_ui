<script setup>
import { DropdownMenuContent, DropdownMenuPortal } from 'reka-ui'
import { cn } from '../../../lib/utils.js'

const props = defineProps({
  sideOffset: { type: Number, default: 6 },
  align:      { type: String, default: 'end' },
  class:      { type: [String, Array, Object], default: '' },
})
</script>

<template>
  <DropdownMenuPortal>
    <DropdownMenuContent
      :side-offset="sideOffset"
      :align="align"
      :class="cn(
        'z-50 min-w-[12rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
        props.class,
      )"
    >
      <slot />
    </DropdownMenuContent>
  </DropdownMenuPortal>
</template>
