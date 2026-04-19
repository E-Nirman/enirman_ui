<script setup>
import { cn } from '../../../lib/utils.js'
const props = defineProps({ class: { type: [String, Array, Object], default: '' } })
</script>

<template>
  <div :class="cn('flex items-center gap-2 border-t border-border px-5 py-3 bg-muted/30', props.class)">
    <slot />
  </div>
</template>
