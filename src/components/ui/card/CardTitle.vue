<script setup>
import { cn } from '../../../lib/utils.js'
const props = defineProps({ class: { type: [String, Array, Object], default: '' } })
</script>

<template>
  <h3 :class="cn('text-sm font-semibold leading-snug tracking-tight text-foreground', props.class)">
    <slot />
  </h3>
</template>
