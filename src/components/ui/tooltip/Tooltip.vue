<script setup>
import { TooltipRoot } from 'reka-ui'

const props = defineProps({
  delayDuration: { type: Number, default: 300 },
})
</script>

<template>
  <TooltipRoot :delay-duration="delayDuration">
    <slot />
  </TooltipRoot>
</template>
