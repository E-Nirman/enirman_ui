<script setup>
import { TabsRoot, useForwardPropsEmits } from 'reka-ui'

const props = defineProps({
  modelValue:       { type: [String, Number], default: undefined },
  defaultValue:     { type: [String, Number], default: undefined },
  orientation:      { type: String, default: 'horizontal' },
  activationMode:   { type: String, default: 'automatic' },
})
const emits = defineEmits(['update:modelValue'])
const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <TabsRoot v-bind="forwarded">
    <slot />
  </TabsRoot>
</template>
