<script setup>
import { PopoverRoot, useForwardPropsEmits } from 'reka-ui'
const props = defineProps({
  open:        { type: Boolean, default: undefined },
  defaultOpen: { type: Boolean, default: undefined },
  modal:       { type: Boolean, default: false },
})
const emits = defineEmits(['update:open'])
const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <PopoverRoot v-bind="forwarded">
    <slot />
  </PopoverRoot>
</template>
