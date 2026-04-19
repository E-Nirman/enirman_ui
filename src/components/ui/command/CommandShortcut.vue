<script setup>
import { cn } from '../../../lib/utils.js'
const props = defineProps({ class: { type: [String, Array, Object], default: '' } })
</script>

<template>
  <span :class="cn('ml-auto text-[10px] tracking-widest text-muted-foreground', props.class)">
    <slot />
  </span>
</template>
