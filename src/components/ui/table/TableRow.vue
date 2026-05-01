<script setup>
import { cn } from '../../../lib/utils.js'
const props = defineProps({ class: { type: [String, Array, Object], default: '' } })
</script>

<template>
  <tr :class="cn(
    'border-b border-border transition-colors hover:bg-accent/60 data-[state=selected]:bg-muted',
    props.class,
  )">
    <slot />
  </tr>
</template>
