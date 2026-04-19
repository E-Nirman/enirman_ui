<script setup>
import { cn } from '../../../lib/utils.js'
const props = defineProps({ class: { type: [String, Array, Object], default: '' } })
</script>

<template>
  <div :class="cn('flex flex-col gap-1 border-b border-border px-5 py-4', props.class)">
    <slot />
  </div>
</template>
