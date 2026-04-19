<script setup>
import { DropdownMenuItem as RekaItem } from 'reka-ui'
import { cn } from '../../../lib/utils.js'

const props = defineProps({
  disabled: { type: Boolean, default: false },
  inset:    { type: Boolean, default: false },
  variant:  { type: String, default: 'default' },
  class:    { type: [String, Array, Object], default: '' },
})
</script>

<template>
  <RekaItem
    :disabled="disabled"
    :class="cn(
      'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-xs outline-none',
      'transition-colors focus:bg-accent focus:text-accent-foreground',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      '[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground',
      inset ? 'pl-8' : '',
      variant === 'destructive' ? 'text-destructive focus:bg-destructive/10 focus:text-destructive [&_svg]:text-destructive' : '',
      props.class,
    )"
  >
    <slot />
  </RekaItem>
</template>
