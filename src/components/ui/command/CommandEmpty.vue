<script setup>
import { ComboboxEmpty } from 'reka-ui'
import { cn } from '../../../lib/utils.js'
const props = defineProps({ class: { type: [String, Array, Object], default: '' } })
</script>

<template>
  <ComboboxEmpty :class="cn('py-8 text-center text-sm text-muted-foreground', props.class)">
    <slot>No results found.</slot>
  </ComboboxEmpty>
</template>
