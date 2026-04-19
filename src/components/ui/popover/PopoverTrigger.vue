<script setup>
import { PopoverTrigger as RekaTrigger } from 'reka-ui'
const props = defineProps({ asChild: { type: Boolean, default: false } })
</script>

<template>
  <RekaTrigger :as-child="asChild">
    <slot />
  </RekaTrigger>
</template>
