<script setup>
import { DialogTitle as RekaDialogTitle } from 'reka-ui'
import { cn } from '../../../lib/utils.js'
const props = defineProps({ class: { type: [String, Array, Object], default: '' } })
</script>

<template>
  <RekaDialogTitle :class="cn('text-base font-semibold leading-none tracking-tight', props.class)">
    <slot />
  </RekaDialogTitle>
</template>
