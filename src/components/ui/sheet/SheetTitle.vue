<script setup>
import { DialogTitle } from 'reka-ui'
import { cn } from '../../../lib/utils.js'
const props = defineProps({ class: { type: [String, Array, Object], default: '' } })
</script>

<template>
  <DialogTitle :class="cn('text-sm font-semibold text-foreground', props.class)">
    <slot />
  </DialogTitle>
</template>
