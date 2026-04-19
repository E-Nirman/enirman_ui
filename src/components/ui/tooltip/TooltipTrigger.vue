<script setup>
import { TooltipTrigger as RekaTooltipTrigger } from 'reka-ui'
const props = defineProps({ asChild: { type: Boolean, default: true } })
</script>

<template>
  <RekaTooltipTrigger :as-child="asChild">
    <slot />
  </RekaTooltipTrigger>
</template>
