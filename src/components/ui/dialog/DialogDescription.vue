<script setup>
import { DialogDescription as RekaDialogDescription } from 'reka-ui'
import { cn } from '../../../lib/utils.js'
const props = defineProps({ class: { type: [String, Array, Object], default: '' } })
</script>

<template>
  <RekaDialogDescription :class="cn('text-xs text-muted-foreground', props.class)">
    <slot />
  </RekaDialogDescription>
</template>
