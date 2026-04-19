<script setup>
import { TabsContent as RekaTabsContent } from 'reka-ui'
import { cn } from '../../../lib/utils.js'

const props = defineProps({
  value: { type: [String, Number], required: true },
  class: { type: [String, Array, Object], default: '' },
})
</script>

<template>
  <RekaTabsContent :value="value" :class="cn('mt-3 focus-visible:outline-none', props.class)">
    <slot />
  </RekaTabsContent>
</template>
