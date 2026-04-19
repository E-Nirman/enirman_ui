<script setup>
import { ComboboxGroup, ComboboxLabel } from 'reka-ui'
import { cn } from '../../../lib/utils.js'

const props = defineProps({
  heading: { type: String, default: '' },
  class:   { type: [String, Array, Object], default: '' },
})
</script>

<template>
  <ComboboxGroup :class="cn('overflow-hidden p-1 text-foreground', props.class)">
    <ComboboxLabel v-if="heading" class="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
      {{ heading }}
    </ComboboxLabel>
    <slot />
  </ComboboxGroup>
</template>
