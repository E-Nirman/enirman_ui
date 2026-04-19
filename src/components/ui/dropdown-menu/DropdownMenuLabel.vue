<script setup>
import { DropdownMenuLabel as RekaLabel } from 'reka-ui'
import { cn } from '../../../lib/utils.js'
const props = defineProps({ class: { type: [String, Array, Object], default: '' } })
</script>

<template>
  <RekaLabel :class="cn('px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground', props.class)">
    <slot />
  </RekaLabel>
</template>
