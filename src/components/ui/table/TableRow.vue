<script setup>
import { cn } from '../../../lib/utils.js'
const props = defineProps({ class: { type: [String, Array, Object], default: '' } })
</script>

<template>
  <tr :class="cn(
    'border-b border-border transition-colors hover:bg-muted/40 data-[state=selected]:bg-muted',
    props.class,
  )">
    <slot />
  </tr>
</template>
