<script setup>
import { cn } from '../../../lib/utils.js'
const props = defineProps({ class: { type: [String, Array, Object], default: '' } })
</script>

<template>
  <th :class="cn(
    'h-10 px-3 text-left align-middle text-[11px] font-semibold uppercase tracking-wider text-muted-foreground',
    'bg-muted/30',
    '[&:has([role=checkbox])]:pr-0',
    props.class,
  )">
    <slot />
  </th>
</template>
