<script setup>
import { DropdownMenuTrigger as RekaTrigger } from 'reka-ui'
const props = defineProps({ asChild: { type: Boolean, default: false }, disabled: { type: Boolean, default: false } })
</script>

<template>
  <RekaTrigger :as-child="asChild" :disabled="disabled">
    <slot />
  </RekaTrigger>
</template>
