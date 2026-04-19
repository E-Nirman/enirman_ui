<script setup>
import { ComboboxContent } from 'reka-ui'
import { cn } from '../../../lib/utils.js'

const props = defineProps({
  class: { type: [String, Array, Object], default: '' },
})
</script>

<template>
  <ComboboxContent
    position="inline"
    :class="cn('max-h-[320px] overflow-y-auto overflow-x-hidden p-1', props.class)"
  >
    <slot />
  </ComboboxContent>
</template>
