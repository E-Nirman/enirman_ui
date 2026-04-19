<script setup>
import { TooltipProvider as RekaTooltipProvider } from 'reka-ui'

const props = defineProps({
  delayDuration: { type: Number, default: 300 },
  disableHoverableContent: { type: Boolean, default: false },
})
</script>

<template>
  <RekaTooltipProvider :delay-duration="delayDuration" :disable-hoverable-content="disableHoverableContent">
    <slot />
  </RekaTooltipProvider>
</template>
