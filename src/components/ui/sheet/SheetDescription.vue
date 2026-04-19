<script setup>
import { DialogDescription } from 'reka-ui'
import { cn } from '../../../lib/utils.js'
const props = defineProps({ class: { type: [String, Array, Object], default: '' } })
</script>

<template>
  <DialogDescription :class="cn('text-xs text-muted-foreground', props.class)">
    <slot />
  </DialogDescription>
</template>
