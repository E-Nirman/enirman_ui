<script setup>
import { cn } from '../../../lib/utils.js'
const props = defineProps({ class: { type: [String, Array, Object], default: '' } })
</script>

<template>
  <div :class="cn('flex flex-col space-y-1 px-4 py-3', props.class)">
    <slot />
  </div>
</template>
