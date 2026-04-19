<script setup>
import { cn } from '../../../lib/utils.js'

const props = defineProps({
  class: { type: [String, Array, Object], default: '' },
})
</script>

<template>
  <div :class="cn('rounded-lg border border-border bg-card text-card-foreground shadow-sm', props.class)">
    <slot />
  </div>
</template>
