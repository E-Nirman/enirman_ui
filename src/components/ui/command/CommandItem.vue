<script setup>
import { ComboboxItem } from 'reka-ui'
import { cn } from '../../../lib/utils.js'

const props = defineProps({
  value:    { type: [String, Number, Object, Boolean], required: true },
  disabled: { type: Boolean, default: false },
  class:    { type: [String, Array, Object], default: '' },
})
</script>

<template>
  <ComboboxItem
    :value="value"
    :disabled="disabled"
    :class="cn(
      'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none',
      'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      '[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground',
      props.class,
    )"
  >
    <slot />
  </ComboboxItem>
</template>
